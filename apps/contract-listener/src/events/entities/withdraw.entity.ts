import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('withdraw_events')
export class WithdrawEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  caller: string;

  @Column()
  receiver: string;

  @Column()
  owner: string;

  @Column()
  assets: string;

  @Column()
  shares: string;

  @Column()
  block: number;

  @CreateDateColumn()
  createdAt: Date;
}
