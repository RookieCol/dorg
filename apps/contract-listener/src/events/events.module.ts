import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventListenerService } from './event-listener.service';
import { DepositEvent } from './entities/deposit.entity';
import { WithdrawEvent } from './entities/withdraw.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DepositEvent, WithdrawEvent])],
  controllers: [EventsController],
  providers: [EventsService, EventListenerService],
  exports: [EventsService],
})
export class EventsModule {}
