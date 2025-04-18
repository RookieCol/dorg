export class VaultDepositDto {
  totalDepositedAssets: string;
  totalReceivedShares: string;
  lastDepositBlock: number;
}

export class VaultWithdrawDto {
  totalWithdrawnAssets: string;
  totalBurnedShares: string;
  lastWithdrawBlock: number;
}

export class DepositRecordDto {
  caller: string;
  receiver: string;
  assets: string;
  shares: string;
  block: number;
  timestamp: Date;
}

export class WithdrawRecordDto {
  caller: string;
  receiver: string;
  owner: string;
  assets: string;
  shares: string;
  block: number;
  timestamp: Date;
}
