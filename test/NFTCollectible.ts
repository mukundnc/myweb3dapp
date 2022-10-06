import { expect } from "chai";
import { ethers } from "hardhat";
import { NFTCollectible } from "../src/typechain-types/contracts/NFTCollectible";
import type { SignerWithAddress   } from "@nomiclabs/hardhat-ethers/signers";

describe("NFTCollectible", function () {
  let contract : NFTCollectible;
  let owner : SignerWithAddress;
  let addr1 : SignerWithAddress;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    [owner, addr1] = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory("NFTCollectible");
    contract = await contractFactory.deploy("baseTokenURI");
    await contract.deployed();
  }); 
  
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    [owner, addr1] = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory("NFTCollectible");
    contract = await contractFactory.deploy("baseTokenURI");
    await contract.deployed();
  });

  it("Reserve NFTs should 10 NFTs reserved", async function () {
    let txn = await contract.reserveNFTs();
    await txn.wait();
    expect(await contract.balanceOf(owner.address)).to.equal(10);
  });

  it("Sending 0.03 ether should mint 3 NFTs", async function () {
    let txn = await contract.mintNFTs(3, 
              { value: ethers.utils.parseEther('0.03') });
    await txn.wait();
    expect(await contract.balanceOf(owner.address)).to.equal(3);
  });

  it("Withdrawal should withdraw the entire balance", async function () {
    let provider = ethers.provider
    const ethBalanceOriginal = await provider.getBalance(owner.address);
    console.log("original eth balanace %f", ethBalanceOriginal);
    let txn = await contract.connect(addr1).mintNFTs(1, 
              { value: ethers.utils.parseEther('0.01') });
    await txn.wait();
    
    const ethBalanceBeforeWithdrawal = await provider.getBalance(owner.address);
    console.log("eth balanace before withdrawal %f", ethBalanceBeforeWithdrawal);
    txn = await contract.connect(owner).withdraw();
    await txn.wait();
    const ethBalanceAfterWithdrawal = await provider.getBalance(owner.address);
    console.log("eth balanace after withdrawal %f", ethBalanceAfterWithdrawal);
    expect(ethBalanceOriginal.eq(ethBalanceBeforeWithdrawal)).to.equal(true);
    expect(ethBalanceAfterWithdrawal.gt
          (ethBalanceBeforeWithdrawal)).to.equal(true);
  });

})