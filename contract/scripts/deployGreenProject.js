async function main() {
  const ecoTokenAddress = "0x1636677DC015C08a4cce8b2cd0f8dEEf4077DB42";
  const adminWallet = "0x3CB2c0fA970B4152728dc578B18A7C9F4C8B6C48";
  const GreenProject = await ethers.getContractFactory("GreenProject");
  const greenProject = await GreenProject.deploy(ecoTokenAddress, adminWallet);
  await greenProject.deployed();
  console.log("GreenProject deployed to:", greenProject.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
