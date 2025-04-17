import { execSync } from "child_process";

// This script verifies a deployed contract on Blockscout
async function main() {
  // Replace with your deployed contract address after deployment
  const VAULT_ADDRESS = "0x6aA4C7396579cE2666F38acB9dfB84BD373e4CB9";
  
  // Trust token address on OP Sepolia
  const TRUST_TOKEN = "0x6B73Afbd5b53827F6d741dD27157E0c34Da83Ff9";

  console.log(`Verifying BasicERC4626Vault at ${VAULT_ADDRESS}...`);
  console.log(`With constructor argument: ${TRUST_TOKEN}`);

  try {
    // Using Hardhat's verify task
    const command = `npx hardhat verify --network op-sepolia ${VAULT_ADDRESS} ${TRUST_TOKEN}`;
    console.log(`Running command: ${command}`);
    
    execSync(command, { stdio: 'inherit' });
    console.log("Verification successful!");
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 