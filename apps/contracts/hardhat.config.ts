import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import dotenv from "dotenv";
// Import tasks
import "./tasks";

// Load environment variables from .env file
dotenv.config();

// Get private key from environment variable or use a default one for local development
// For network deployment, you MUST set PRIVATE_KEY in .env file
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.25",
  networks: {
    // Optimism Sepolia testnet
    "op-sepolia": {
      url: "https://sepolia.optimism.io",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155420,
    },
  },
  etherscan: {
    apiKey: {
      "op-sepolia": " ",
    },
    customChains: [
      {
        network: "op-sepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://optimism-sepolia.blockscout.com/api?module=contract&action=verify",
          browserURL: "https://optimism-sepolia.blockscout.com",
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
