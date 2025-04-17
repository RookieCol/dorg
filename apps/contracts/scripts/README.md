# DorgVault Interaction Scripts

These scripts allow you to interact with the DorgVault ERC-4626 contract on Optimism Sepolia.

## Quick Usage

To deposit 1.5 TRUST tokens to the vault:
```bash
npx hardhat run scripts/deposit.ts --network op-sepolia 1.5
```

To withdraw 0.5 TRUST tokens from the vault:
```bash
npx hardhat run scripts/withdraw.ts --network op-sepolia 0.5
```

## Contract Details

- **Contract**: DorgVault (ERC-4626 vault)
- **Address**: `0x6aA4C7396579cE2666F38acB9dfB84BD373e4CB9`
- **Network**: Optimism Sepolia (ChainID: 11155420)
- **Underlying Token**: Trust Token (`0x6B73Afbd5b53827F6d741dD27157E0c34Da83Ff9`)

## Prerequisites

- Make sure you have your private key configured in the `.env` file
- Make sure you have TRUST tokens in your wallet if you want to deposit
- Make sure you have OP Sepolia ETH for gas fees

## Script Features

### Deposit Script

The deposit script (`deposit.ts`):
- Takes an amount parameter from the command line
- Approves TRUST tokens to be spent by the vault
- Deposits tokens into the vault
- Shows your new vault share balance

### Withdraw Script

The withdraw script (`withdraw.ts`):
- Takes an amount parameter from the command line
- Checks if you have enough vault shares to withdraw the specified amount
- Withdraws the tokens from the vault
- Shows your updated balances

## Troubleshooting

If you encounter any errors:

1. **Error checking token balance**:
   - This may happen if the TRUST token contract doesn't fully implement the ERC20 standard
   - The script will continue to attempt the deposit/withdraw operation

2. **Transaction Failed**:
   - Make sure you have enough OP Sepolia ETH for gas
   - Make sure you have enough TRUST tokens to deposit or enough vault shares to withdraw
   - The OP Sepolia network may be congested - try again later

3. **Connection Issues**:
   - If you can't connect to OP Sepolia, check that the RPC URL in your Hardhat config is correct

## Default Behavior

If you don't specify an amount, both scripts will default to using 1.0 as the amount to deposit or withdraw. 