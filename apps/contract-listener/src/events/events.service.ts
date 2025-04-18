import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepositEvent } from './entities/deposit.entity';
import { WithdrawEvent } from './entities/withdraw.entity';
import { DepositEventDto, WithdrawEventDto } from './dto/wallet-events.dto';
import {
  VaultDepositDto,
  VaultWithdrawDto,
  DepositRecordDto,
  WithdrawRecordDto,
} from './dto/vault.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(DepositEvent)
    private depositRepo: Repository<DepositEvent>,
    @InjectRepository(WithdrawEvent)
    private withdrawRepo: Repository<WithdrawEvent>,
  ) {}

  async saveDeposit(
    caller: string,
    receiver: string,
    assets: string,
    shares: string,
    block: number,
  ): Promise<void> {
    try {
      const deposit = this.depositRepo.create({
        caller,
        receiver,
        assets,
        shares,
        block,
      });
      await this.depositRepo.save(deposit);
      this.logger.log(`Saved deposit event from block ${block}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error saving deposit event: ${errorMessage}`);
      throw error;
    }
  }

  async saveWithdraw(
    caller: string,
    receiver: string,
    owner: string,
    assets: string,
    shares: string,
    block: number,
  ): Promise<void> {
    try {
      const withdraw = this.withdrawRepo.create({
        caller,
        receiver,
        owner,
        assets,
        shares,
        block,
      });
      await this.withdrawRepo.save(withdraw);
      this.logger.log(`Saved withdraw event from block ${block}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error saving withdraw event: ${errorMessage}`);
      throw error;
    }
  }

  async getDepositsByWallet(wallet: string): Promise<DepositEventDto[]> {
    try {
      const deposits = await this.depositRepo.find({
        where: [{ caller: wallet }, { receiver: wallet }],
        order: {
          block: 'DESC',
        },
      });

      return deposits.map((deposit) => ({
        caller: deposit.caller,
        receiver: deposit.receiver,
        assets: deposit.assets,
        shares: deposit.shares,
        block: deposit.block,
        timestamp: deposit.createdAt,
      }));
    } catch (error) {
      this.logger.error(
        `Error fetching deposits for wallet ${wallet}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      throw error;
    }
  }

  async getWithdrawalsByWallet(wallet: string): Promise<WithdrawEventDto[]> {
    try {
      const withdrawals = await this.withdrawRepo.find({
        where: [{ caller: wallet }, { receiver: wallet }, { owner: wallet }],
        order: {
          block: 'DESC',
        },
      });

      return withdrawals.map((withdrawal) => ({
        caller: withdrawal.caller,
        receiver: withdrawal.receiver,
        owner: withdrawal.owner,
        assets: withdrawal.assets,
        shares: withdrawal.shares,
        block: withdrawal.block,
        timestamp: withdrawal.createdAt,
      }));
    } catch (error) {
      this.logger.error(
        `Error fetching withdrawals for wallet ${wallet}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      throw error;
    }
  }

  async findDeposits(wallet: string): Promise<VaultDepositDto> {
    try {
      const deposits = await this.depositRepo.find({
        where: { receiver: wallet },
        order: { block: 'DESC' },
      });

      let totalDepositedAssets = BigInt(0);
      let totalReceivedShares = BigInt(0);
      let lastDepositBlock = 0;

      for (const deposit of deposits) {
        totalDepositedAssets += BigInt(deposit.assets);
        totalReceivedShares += BigInt(deposit.shares);
        lastDepositBlock = Math.max(lastDepositBlock, deposit.block);
      }

      return {
        totalDepositedAssets: totalDepositedAssets.toString(),
        totalReceivedShares: totalReceivedShares.toString(),
        lastDepositBlock,
      };
    } catch (error) {
      this.logger.error(
        `Error finding deposits for wallet ${wallet}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      throw error;
    }
  }

  async findWithdrawals(wallet: string): Promise<VaultWithdrawDto> {
    try {
      const withdrawals = await this.withdrawRepo.find({
        where: { owner: wallet },
        order: { block: 'DESC' },
      });

      let totalWithdrawnAssets = BigInt(0);
      let totalBurnedShares = BigInt(0);
      let lastWithdrawBlock = 0;

      for (const withdrawal of withdrawals) {
        totalWithdrawnAssets += BigInt(withdrawal.assets);
        totalBurnedShares += BigInt(withdrawal.shares);
        lastWithdrawBlock = Math.max(lastWithdrawBlock, withdrawal.block);
      }

      return {
        totalWithdrawnAssets: totalWithdrawnAssets.toString(),
        totalBurnedShares: totalBurnedShares.toString(),
        lastWithdrawBlock,
      };
    } catch (error) {
      this.logger.error(
        `Error finding withdrawals for wallet ${wallet}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      throw error;
    }
  }

  async getDepositRecords(wallet: string): Promise<DepositRecordDto[]> {
    try {
      const deposits = await this.depositRepo.find({
        where: { receiver: wallet },
        order: { block: 'DESC' },
      });

      return deposits.map((deposit) => ({
        caller: deposit.caller,
        receiver: deposit.receiver,
        assets: deposit.assets,
        shares: deposit.shares,
        block: deposit.block,
        timestamp: deposit.createdAt,
      }));
    } catch (error) {
      this.logger.error(
        `Error getting deposit records for wallet ${wallet}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      throw error;
    }
  }

  async getWithdrawRecords(wallet: string): Promise<WithdrawRecordDto[]> {
    try {
      const withdrawals = await this.withdrawRepo.find({
        where: { owner: wallet },
        order: { block: 'DESC' },
      });

      return withdrawals.map((withdrawal) => ({
        caller: withdrawal.caller,
        receiver: withdrawal.receiver,
        owner: withdrawal.owner,
        assets: withdrawal.assets,
        shares: withdrawal.shares,
        block: withdrawal.block,
        timestamp: withdrawal.createdAt,
      }));
    } catch (error) {
      this.logger.error(
        `Error getting withdrawal records for wallet ${wallet}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      throw error;
    }
  }
}
