import { ethers } from "hardhat";
import { parseUnits, formatUnits } from "ethers";

// Contract addresses
const VAULT_ADDRESS = "0x6aA4C7396579cE2666F38acB9dfB84BD373e4CB9";
const TRUST_TOKEN_ADDRESS = "0x6B73Afbd5b53827F6d741dD27157E0c34Da83Ff9";

// Simplified ABIs for needed functions
const vaultAbi = [
  "function withdraw(uint256 assets, address receiver, address owner) returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function convertToAssets(uint256 shares) view returns (uint256)",
  "function maxWithdraw(address owner) view returns (uint256)"
];

const erc20Abi = [
  "function balanceOf(address account) view returns (uint256)",
  "function symbol() view returns (string)"
];

// Hardcoded token details since the contract might not follow ERC20 standard
const TOKEN_SYMBOL = "TRUST";
const TOKEN_DECIMALS = 18;

/**
 * Withdraw Trust tokens from the DorgVault
 * @param {string} amount Amount to withdraw in ether units (e.g., "1.0")
 */
async function main() {
  // Get amount from command line or use default
  const args = process.argv.slice(2);
  const withdrawAmount = args[0] || "1.0";
  
  console.log(`Withdraw amount: ${withdrawAmount} ${TOKEN_SYMBOL}`);
  
  // Get the signer
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();
  
  console.log(`Using account: ${signerAddress}`);
  
  // Create contract instances
  const trustToken = new ethers.Contract(TRUST_TOKEN_ADDRESS, erc20Abi, signer);
  const vault = new ethers.Contract(VAULT_ADDRESS, vaultAbi, signer);
  
  // Convert amount to wei based on token decimals
  const amountInWei = parseUnits(withdrawAmount, TOKEN_DECIMALS);
  
  try {
    // Check vault balances
    const vaultShares = await vault.balanceOf(signerAddress);
    const maxWithdraw = await vault.maxWithdraw(signerAddress);
    const sharesValue = await vault.convertToAssets(vaultShares);
    
    console.log(`
Withdrawal Information:
---------------------------
Your vault shares: ${formatUnits(vaultShares, TOKEN_DECIMALS)}
Shares value in ${TOKEN_SYMBOL}: ${formatUnits(sharesValue, TOKEN_DECIMALS)}
Maximum withdrawable amount: ${formatUnits(maxWithdraw, TOKEN_DECIMALS)} ${TOKEN_SYMBOL}
Amount to withdraw: ${withdrawAmount} ${TOKEN_SYMBOL}
    `);
    
    // Check if user has enough to withdraw
    if (amountInWei > maxWithdraw) {
      console.error(`Insufficient balance to withdraw. 
You requested: ${withdrawAmount} ${TOKEN_SYMBOL}
Maximum available: ${formatUnits(maxWithdraw, TOKEN_DECIMALS)} ${TOKEN_SYMBOL}`);
      return;
    }
    
    // Execute withdrawal
    console.log(`\nWithdrawing ${withdrawAmount} ${TOKEN_SYMBOL} from vault...`);
    const withdrawTx = await vault.withdraw(
      amountInWei,
      signerAddress,
      signerAddress
    );
    console.log(`Withdrawal transaction submitted: ${withdrawTx.hash}`);
    
    // Wait for withdrawal to be confirmed
    const withdrawReceipt = await withdrawTx.wait();
    console.log(`Withdrawal confirmed in block ${withdrawReceipt?.blockNumber || 'unknown'}!`);
    
    // Get updated balances
    try {
      const newTrustBalance = await trustToken.balanceOf(signerAddress);
      const newVaultShares = await vault.balanceOf(signerAddress);
      const newSharesValue = newVaultShares > 0n ? await vault.convertToAssets(newVaultShares) : 0n;
      
      console.log(`\nWithdrawal Summary:
---------------------------
New ${TOKEN_SYMBOL} balance: ${formatUnits(newTrustBalance, TOKEN_DECIMALS)} ${TOKEN_SYMBOL}
Remaining vault shares: ${formatUnits(newVaultShares, TOKEN_DECIMALS)}
Remaining shares value: ${formatUnits(newSharesValue, TOKEN_DECIMALS)} ${TOKEN_SYMBOL}
`);
    } catch (err) {
      const error = err as Error;
      console.error("Error checking updated balances:", error.message);
      console.log("Withdrawal completed successfully!");
    }
  } catch (err) {
    const error = err as Error;
    console.error("Transaction failed:", error);
  }
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 