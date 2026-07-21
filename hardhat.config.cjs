require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

const sepoliaUrl = process.env.SEPOLIA_RPC_URL || process.env.VITE_RPC_URL;
let sepoliaKey = process.env.PRIVATE_KEY || process.env.VITE_PRIVATE_KEY || '';

// Ensure private key string starts with 0x when provided
if (sepoliaKey && !sepoliaKey.startsWith('0x')) {
  sepoliaKey = `0x${sepoliaKey}`;
}

if (!sepoliaUrl) {
  throw new Error('Missing SEPOLIA_RPC_URL or VITE_RPC_URL in environment variables.');
}

if (!sepoliaKey) {
  throw new Error('Missing PRIVATE_KEY or VITE_PRIVATE_KEY in environment variables.');
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
