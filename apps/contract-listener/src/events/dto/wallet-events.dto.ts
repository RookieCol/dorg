export class DepositEventDto {
  caller: string;
  receiver: string;
  assets: string;
  shares: string;
  block: number;
  timestamp: Date;
}

export class WithdrawEventDto {
  caller: string;
  receiver: string;
  owner: string;
  assets: string;
  shares: string;
  block: number;
  timestamp: Date;
}
