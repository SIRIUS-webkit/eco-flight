require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan"); // Add this for contract verification
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.27", // Solidity version
      },
    ],
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`, // Infura RPC URL for Sepolia
      chainId: 11155111, // Sepolia chain ID
      accounts: [process.env.ACCOUNT_PRIVATE_KEY], // Your private key from .env
    },
  },
  etherscan: {
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://blockscout.com/eth/sepolia/api", // Blockscout API URL for Sepolia
          browserURL: "https://blockscout.com/eth/sepolia", // Blockscout browser URL
        },
      },
    ],
  },
};
