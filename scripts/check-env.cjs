const fs = require('fs');
require('dotenv').config();

const sepoliaUrl = process.env.SEPOLIA_RPC_URL || process.env.VITE_RPC_URL || '';
let sepoliaKey = process.env.PRIVATE_KEY || process.env.VITE_PRIVATE_KEY || '';
if (sepoliaKey && !sepoliaKey.startsWith('0x')) sepoliaKey = `0x${sepoliaKey}`;

console.log('Checking environment for Sepolia deployment...');
console.log('SEPOLIA_RPC_URL:', sepoliaUrl ? 'OK' : 'MISSING');
console.log('PRIVATE_KEY:', sepoliaKey ? (sepoliaKey.length > 10 ? 'OK' : 'INVALID') : 'MISSING');

if (!sepoliaUrl || !sepoliaKey) {
  console.error('\nFix the missing variables by creating a .env file in project root with:');
  console.error('SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY');
  console.error('PRIVATE_KEY=0xYOUR_PRIVATE_KEY');
  process.exit(1);
}

console.log('\nEnvironment appears valid for deployment.');
