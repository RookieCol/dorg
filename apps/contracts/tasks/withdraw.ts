import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { parseUnits } from "ethers";

// Default values
const DEFAULT_VAULT_ADDRESS = "0x6aA4C7396579cE2666F38acB9dfB84BD373e4CB9";
const DEFAULT_TOKEN_SYMBOL = "TRUST";
const DEFAULT_TOKEN_DECIMALS = 18;

// Simplified ABI for the vault
const vaultAbi = [
  "function withdraw(uint256 assets, address receiver, address owner) returns (uint256)"
];

task("withdraw", "Withdraw assets from the vault")
  .addOptionalParam("vault", "Vault contract address", DEFAULT_VAULT_ADDRESS)
  .addOptionalParam("amount", "Amount to withdraw", "1.0")
  .addOptionalParam("decimals", "Token decimals", DEFAULT_TOKEN_DECIMALS.toString())
  .addOptionalParam("symbol", "Token symbol", DEFAULT_TOKEN_SYMBOL)
  .addOptionalParam("receiver", "Address to receive the withdrawn assets", "") // If empty, use the sender
  .setAction(async (
    taskArgs: { 
      vault: string; 
      amount: string;
      decimals: string;
      symbol: string;
      receiver: string;
    }, 
    hre: HardhatRuntimeEnvironment
  ) => {
    const vaultAddress = taskArgs.vault;
    const withdrawAmount = taskArgs.amount;
    const tokenDecimals = parseInt(taskArgs.decimals);
    const tokenSymbol = taskArgs.symbol;
    
    // Get the signer
    const [signer] = await hre.ethers.getSigners();
    const signerAddress = await signer.getAddress();
    
    // Set receiver to signer if not specified
    const receiverAddress = taskArgs.receiver || signerAddress;
    
    console.log(`Using account: ${signerAddress}`);
    console.log(`Withdrawing ${withdrawAmount} ${tokenSymbol} from vault at ${vaultAddress}`);
    console.log(`Assets will be sent to: ${receiverAddress}`);
    
    // Create vault contract instance
    const vaultContract = new hre.ethers.Contract(vaultAddress, vaultAbi, signer);
    
    // Convert amount to token units with proper decimals
    const amountInTokenUnits = parseUnits(withdrawAmount, tokenDecimals);
    
    console.log(`Withdrawing ${withdrawAmount} ${tokenSymbol}...`);
    
    // Withdraw assets from the vault
    // Parameters: assets, receiver, owner
    const withdrawTx = await vaultContract.withdraw(
      amountInTokenUnits,
      receiverAddress,
      signerAddress
    );
    
    console.log(`Transaction hash: ${withdrawTx.hash}`);
    console.log(`Waiting for transaction confirmation...`);
    
    // Wait for transaction confirmation
    const receipt = await withdrawTx.wait();
    
    console.log(`Withdrawal successful!`);
  }); 