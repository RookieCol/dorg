import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('deposit_events')
export class DepositEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  caller: string;

  @Column()
  receiver: string;

  @Column()
  assets: string;

  @Column()
  shares: string;

  @Column()
  block: number;

  @CreateDateColumn()
  createdAt: Date;
}
