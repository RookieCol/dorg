import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VaultModule", (m) => {
  // This is a placeholder for a real ERC20 token address
  // For testnet deployment, you'll need to use a real ERC20 token address on Optimism Sepolia
  const mockERC20Address = m.getParameter("Trust", "0x6B73Afbd5b53827F6d741dD27157E0c34Da83Ff9");

  // Deploy the vault with the specified ERC20 token
  // The first parameter passed to the BasicERC4626Vault constructor is the ERC20 asset_ address
  const vault = m.contract("BasicERC4626Vault", [mockERC20Address]);

  return { vault };
}); 