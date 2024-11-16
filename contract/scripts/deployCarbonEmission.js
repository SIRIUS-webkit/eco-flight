async function main() {
  const CarbonEmission = await ethers.getContractFactory("CarbonEmission");
  const carbonEmission = await CarbonEmission.deploy();
  await carbonEmission.deployed();
  console.log("CarbonEmission deployed to:", carbonEmission.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
