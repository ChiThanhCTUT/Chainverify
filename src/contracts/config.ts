/**
 * [CÔNG - SMART CONTRACT CONFIG TODO - Module 11, 12, 14]
 * - Sau khi CÔNG compile và deploy Smart Contract bằng Hardhat (Module 12), CÔNG sẽ cập nhật:
 *   1. CONTRACT_ADDRESS: Địa chỉ hợp đồng vừa deploy (ví dụ trên Sepolia hoặc Localhost)
 *   2. SUPPORTED_CHAIN_ID: ID của mạng lưới (11155111 cho Sepolia, 31337 cho Hardhat Local)
 */

export const CONTRACT_ADDRESS: string = "0x54ce598f909785BB835cccEB75F00AC99A32D373"; // [CÔNG: Điền địa chỉ Smart Contract ở đây]

export const SUPPORTED_CHAIN_ID = 11155111; // 11155111 (Sepolia Testnet) hoặc 31337 (Hardhat Local)
export const RPC_URL = "https://rpc.sepolia.org";

export const NETWORK_NAMES: Record<number, string> = {
  1: "Ethereum Mainnet",
  11155111: "Sepolia Testnet",
  31337: "Hardhat Localhost",
};
