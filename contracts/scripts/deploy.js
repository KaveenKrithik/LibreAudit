import hre from "hardhat";

async function main() {
  const ChainSheetRegistry = await hre.ethers.getContractFactory("ChainSheetRegistry");
  const registry = await ChainSheetRegistry.deploy();

  await registry.waitForDeployment();

  console.log("ChainSheetRegistry deployed to:", await registry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
