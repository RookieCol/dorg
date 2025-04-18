import { Controller, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { VaultDepositDto, VaultWithdrawDto } from './dto/vault-state.dto';

@Controller('vault')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('deposits/:wallet')
  async getDeposits(@Param('wallet') wallet: string): Promise<VaultDepositDto> {
    return await this.eventsService.findDeposits(wallet);
  }

  @Get('withdrawals/:wallet')
  async getWithdrawals(
    @Param('wallet') wallet: string,
  ): Promise<VaultWithdrawDto> {
    return await this.eventsService.findWithdrawals(wallet);
  }
}
