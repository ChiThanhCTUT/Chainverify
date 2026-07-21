const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  const CertificateRegistry = await ethers.getContractFactory('CertificateRegistry');
  const registry = await CertificateRegistry.deploy();

  await registry.deployed(); // Sửa thành deployed() cho Ethers v5

  const addr = registry.address; // Lấy địa chỉ bằng .address cho Ethers v5
  console.log('CertificateRegistry deployed to:', addr);

  // Try to update src/contracts/config.ts with the deployed address
  try {
    const configPath = path.join(__dirname, '..', 'src', 'contracts', 'config.ts');
    if (fs.existsSync(configPath)) {
      let cfg = fs.readFileSync(configPath, 'utf8');
      const replaced = cfg.replace(/export const CONTRACT_ADDRESS: string = .*;/, `export const CONTRACT_ADDRESS: string = "${addr}";`);
      fs.writeFileSync(configPath, replaced, 'utf8');
      console.log('Updated src/contracts/config.ts with CONTRACT_ADDRESS.');
    } else {
      console.warn('config.ts not found; skipping auto-update.');
    }
  } catch (err) {
    console.warn('Could not update config.ts automatically:', err.message || err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});