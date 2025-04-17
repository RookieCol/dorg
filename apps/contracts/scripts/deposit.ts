import { ethers } from "hardhat";
import { parseUnits, formatUnits } from "ethers";

// Contract addresses
const VAULT_ADDRESS = "0x6aA4C7396579cE2666F38acB9dfB84BD373e4CB9";
const TRUST_TOKEN_ADDRESS = "0x6B73Afbd5b53827F6d741dD27157E0c34Da83Ff9";

// Simplified ABIs for needed functions - only include what we actually use
const vaultAbi = [
  "function deposit(uint256 assets, address receiver) returns (uint256)"
];

const erc20Abi = [
  "function approve(address spender, uint256 amount) returns (bool)"
];

// Hardcoded token details since the contract might not follow ERC20 standard
const TOKEN_SYMBOL = "TRUST";
const TOKEN_DECIMALS = 18;

/**
 * Deposit Trust tokens to the DorgVault - Simplified version that works with non-standard contracts
 * @param {string} amount Amount to deposit in ether units (e.g., "1.0")
 */
async function main() {
  // Get amount from command line or use default
  const args = process.argv.slice(2);
  const depositAmount = args[0] || "1.0";
  
  console.log(`Deposit amount: ${depositAmount} ${TOKEN_SYMBOL}`);
  
  // Get the signer
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();
  
  console.log(`Using account: ${signerAddress}`);
  
  // Create contract instances
  const trustToken = new ethers.Contract(TRUST_TOKEN_ADDRESS, erc20Abi, signer);
  const vault = new ethers.Contract(VAULT_ADDRESS, vaultAbi, signer);
  
  // Convert amount to wei based on token decimals
  const amountInWei = parseUnits(depositAmount, TOKEN_DECIMALS);
  
  console.log(`
Deposit Transaction Details:
---------------------------
Vault Address: ${VAULT_ADDRESS}
Token: ${TOKEN_SYMBOL} (${TRUST_TOKEN_ADDRESS})
Deposit Amount: ${depositAmount} ${TOKEN_SYMBOL}
Amount in Wei: ${amountInWei.toString()}
  `);
  
  // try {
    // Approve tokens to vault - this should work regardless of ERC20 compliance
    console.log(`\nApproving ${depositAmount} ${TOKEN_SYMBOL} to be spent by vault...`);
    const approveTx = await trustToken.approve(VAULT_ADDRESS, amountInWei);
    console.log(`Approval transaction submitted: ${approveTx.hash}`);
    
    // Wait for approval to be confirmed
    const approvalReceipt = await approveTx.wait();
    console.log(`Approval confirmed in block ${approvalReceipt || 'unknown'}`);
    
  //   // Deposit into vault
  //   console.log(`\nDepositing ${depositAmount} ${TOKEN_SYMBOL} into vault...`);
  //   const depositTx = await vault.deposit(amountInWei, signerAddress);
  //   console.log(`Deposit transaction submitted: ${depositTx.hash}`);
    
  //   // Wait for deposit to be confirmed
  //   const depositReceipt = await depositTx.wait();
  //   console.log(`Deposit confirmed in block ${depositReceipt?.blockNumber || 'unknown'}!`);
  //   console.log('\nDeposit completed successfully!');
    
  // } catch (err) {
  //   const error = err as Error;
  //   console.error("Transaction failed:", error.message);
  //   process.exit(1);
  //  }
}


// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
