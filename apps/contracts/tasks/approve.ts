import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { parseUnits } from "ethers";

// Default token details
const DEFAULT_TOKEN_ADDRESS = "0x6B73Afbd5b53827F6d741dD27157E0c34Da83Ff9"; // TRUST token
const DEFAULT_SPENDER_ADDRESS = "0x6aA4C7396579cE2666F38acB9dfB84BD373e4CB9"; // Vault
const DEFAULT_TOKEN_SYMBOL = "TRUST";
const DEFAULT_TOKEN_DECIMALS = 18;

// Simplified ABIs for needed functions
const erc20Abi = [
  "function approve(address spender, uint256 amount) returns (bool)"
];

task("approve", "Approve ERC20 tokens to any spender")
  .addOptionalParam("token", "ERC20 token address", DEFAULT_TOKEN_ADDRESS)
  .addOptionalParam("spender", "Spender address", DEFAULT_SPENDER_ADDRESS)
  .addOptionalParam("amount", "Amount to approve", "1.0")
  .addOptionalParam("decimals", "Token decimals", DEFAULT_TOKEN_DECIMALS.toString())
  .addOptionalParam("symbol", "Token symbol", DEFAULT_TOKEN_SYMBOL)
  .setAction(async (
    taskArgs: { 
      token: string; 
      spender: string; 
      amount: string;
      decimals: string;
      symbol: string;
    }, 
    hre: HardhatRuntimeEnvironment
  ) => {
    const tokenAddress = taskArgs.token;
    const spenderAddress = taskArgs.spender;
    const approvalAmount = taskArgs.amount;
    const tokenDecimals = parseInt(taskArgs.decimals);
    const tokenSymbol = taskArgs.symbol;
    
    console.log(`Approving ${approvalAmount} ${tokenSymbol} to address ${spenderAddress}`);
    
    // Get the signer
    const [signer] = await hre.ethers.getSigners();
    const signerAddress = await signer.getAddress();
    
    console.log(`Using account: ${signerAddress}`);
    
    // Create contract instance
    const tokenContract = new hre.ethers.Contract(tokenAddress, erc20Abi, signer);
    
    // Convert amount to token units with proper decimals
    const amountInTokenUnits = parseUnits(approvalAmount, tokenDecimals);
    
    console.log(`Approving ${approvalAmount} ${tokenSymbol}...`);
    
    // Approve tokens
    const approveTx = await tokenContract.approve(spenderAddress, amountInTokenUnits);
    
    console.log(`Transaction hash: ${approveTx.hash}`);
    console.log(`Waiting for transaction confirmation...`);
    
    // Wait for transaction confirmation
    await approveTx.wait();
    
    console.log(`Approval successful!`);
  }); 