import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  // defaultNetwork: "hardhat",
  defaultNetwork: "goerli",
  networks: {
    goerli: {
      url: process.env.ALCHEMY_RPC_URL_GOERLI,
      accounts: [process.env.PRIVATE_KEY_GOERLI!]
    },
    mumbai: {
      url: process.env.ALCHEMY_RPC_URL_MUMBAI,
      accounts: [process.env.PRIVATE_KEY_MUMBAI!]
    }
  }
};

export default config;
