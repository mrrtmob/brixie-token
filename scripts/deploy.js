const hre = require("hardhat");

async function main() {
  const BrixieToken = await hre.ethers.getContractFactory("BrixieToken");
  const brixieToken = await BrixieToken.deploy(100000000, 50);

  await brixieToken.deployed();

  console.log("Brixie Token deployed: ", brixieToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
