import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepositEvent } from './entities/deposit.entity';
import { WithdrawEvent } from './entities/withdraw.entity';

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
  ) {
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
  ) {
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
}
