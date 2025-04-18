import { Controller, Get, Param, Logger } from '@nestjs/common';
import { EventsService } from './events.service';
import {
  VaultDepositDto,
  VaultWithdrawDto,
  DepositRecordDto,
  WithdrawRecordDto,
} from './dto/vault.dto';

@Controller('vault')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Get('deposits/:wallet')
  async getDeposits(@Param('wallet') wallet: string): Promise<VaultDepositDto> {
    this.logger.log(`Getting deposit summary for wallet: ${wallet}`);
    return this.eventsService.findDeposits(wallet);
  }

  @Get('withdrawals/:wallet')
  async getWithdrawals(
    @Param('wallet') wallet: string,
  ): Promise<VaultWithdrawDto> {
    this.logger.log(`Getting withdrawal summary for wallet: ${wallet}`);
    return this.eventsService.findWithdrawals(wallet);
  }

  @Get('deposits/:wallet/history')
  async getDepositRecords(
    @Param('wallet') wallet: string,
  ): Promise<DepositRecordDto[]> {
    this.logger.log(`Getting deposit history for wallet: ${wallet}`);
    return this.eventsService.getDepositRecords(wallet);
  }

  @Get('withdrawals/:wallet/history')
  async getWithdrawRecords(
    @Param('wallet') wallet: string,
  ): Promise<WithdrawRecordDto[]> {
    this.logger.log(`Getting withdrawal history for wallet: ${wallet}`);
    return this.eventsService.getWithdrawRecords(wallet);
  }
}
