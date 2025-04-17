import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { parseUnits } from "ethers";

// Default values
const DEFAULT_VAULT_ADDRESS = "0x6aA4C7396579cE2666F38acB9dfB84BD373e4CB9";
const DEFAULT_TOKEN_SYMBOL = "TRUST";
const DEFAULT_TOKEN_DECIMALS = 18;

// Simplified ABI for the vault
const vaultAbi = [
  "function deposit(uint256 assets, address receiver) returns (uint256)"
];

task("deposit", "Deposit assets to the vault (requires prior approval)")
  .addOptionalParam("vault", "Vault contract address", DEFAULT_VAULT_ADDRESS)
  .addOptionalParam("amount", "Amount to deposit", "1.0")
  .addOptionalParam("decimals", "Token decimals", DEFAULT_TOKEN_DECIMALS.toString())
  .addOptionalParam("symbol", "Token symbol", DEFAULT_TOKEN_SYMBOL)
  .setAction(async (
    taskArgs: { 
      vault: string; 
      amount: string;
      decimals: string;
      symbol: string;
    }, 
    hre: HardhatRuntimeEnvironment
  ) => {
    const vaultAddress = taskArgs.vault;
    const depositAmount = taskArgs.amount;
    const tokenDecimals = parseInt(taskArgs.decimals);
    const tokenSymbol = taskArgs.symbol;
    
    console.log(`Depositing ${depositAmount} ${tokenSymbol} to vault at ${vaultAddress}`);
    
    // Get the signer
    const [signer] = await hre.ethers.getSigners();
    const signerAddress = await signer.getAddress();
    
    console.log(`Using account: ${signerAddress}`);
    
    // Create vault contract instance
    const vaultContract = new hre.ethers.Contract(vaultAddress, vaultAbi, signer);
    
    // Convert amount to token units with proper decimals
    const amountInTokenUnits = parseUnits(depositAmount, tokenDecimals);
    
    console.log(`Depositing ${depositAmount} ${tokenSymbol}...`);
    
    // Deposit assets to the vault
    const depositTx = await vaultContract.deposit(amountInTokenUnits, signerAddress);
    
    console.log(`Transaction hash: ${depositTx.hash}`);
    console.log(`Waiting for transaction confirmation...`);
    
    // Wait for transaction confirmation
    const receipt = await depositTx.wait();
    
    console.log(`Deposit successful!`);
  }); 