import { ethers } from "hardhat";

async function main() {
  const baseTokenURI = "ipfs://QmPT6psX29phUQzeQJVwEo3QcgawVYuDZBrfd4yNtJ3W2i/"; 
  // Get contract that we want to deploy
  const contractFactory = await ethers.getContractFactory("NFTCollectible");
  // Deploy contract with the correct constructor arguments
  const contract = await contractFactory.deploy(baseTokenURI);

  // Wait for this transaction to be mined
  await contract.deployed();
  // console.log(await ethers.getSigner(contract.address));
  console.log("NFTCollectible deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
