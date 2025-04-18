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
