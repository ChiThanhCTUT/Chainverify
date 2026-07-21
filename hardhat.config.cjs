require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

const sepoliaUrl = process.env.SEPOLIA_RPC_URL || process.env.VITE_RPC_URL;
let sepoliaKey = process.env.PRIVATE_KEY || process.env.VITE_PRIVATE_KEY || '';

// Ensure private key string starts with 0x when provided
if (sepoliaKey && !sepoliaKey.startsWith('0x')) {
  sepoliaKey = `0x${sepoliaKey}`;
}

if (!sepoliaUrl && process.argv.includes('sepolia')) {
  console.warn('⚠️ Missing SEPOLIA_RPC_URL in environment variables when deploying to Sepolia.');
}

if (!sepoliaKey && process.argv.includes('sepolia')) {
  console.warn('⚠️ Missing PRIVATE_KEY in environment variables when deploying to Sepolia.');
}

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './src/contracts/solidity',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    sepolia: {
      url: sepoliaUrl,
      accounts: [sepoliaKey],
    },
  },
};
