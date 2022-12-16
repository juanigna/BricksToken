
const { expect } = require("chai");
const {ethers} = require("hardhat");

let signers = {};

let BrickToken;
let BrickTokenInstance;

describe("BricksToken", function(){
  describe("Deploying contract", function(){
    it("Should deploy the smart contract", async function(){
      const [owner, firstUser, secondUser] = await ethers.getSigners();
      signers.owner = owner;
      signers.firstUser = firstUser;
      signers.secondUser = secondUser;

      BrickToken = await ethers.getContractFactory("BrickToken", signers.owner);
      BrickTokenInstance = await BrickToken.deploy();
      await BrickTokenInstance.deployed();
    })
  })

  describe("Minting and transfer", function(){
    it("Should allow to mint tokens to the owner", async function(){
      const tokenAmount = 1000;

      let balanceBefore = await BrickTokenInstance.balanceOf(signers.owner.address);

      let mintToOwnerTx = await BrickTokenInstance.mint(signers.owner.address, tokenAmount);
      await mintToOwnerTx.wait();

      let balanceAfter = await BrickTokenInstance.balanceOf(signers.owner.address);

      expect(balanceAfter).to.equal(balanceBefore + balanceAfter);
    })

    it("Should allow to transfer tokens from owner to a second user", async function(){
      const transferAmount = 100;
      let balanceOwnerBefore = await BrickTokenInstance.balanceOf(signers.owner.address);
      let balanceFirstUserBefore = await BrickTokenInstance.balanceOf(signers.firstUser.address);

      let transferTx = await BrickTokenInstance.transfer(signers.firstUser.address, transferAmount);
      await transferTx.wait();

      let balanceOwnerAfter = await BrickTokenInstance.balanceOf(signers.owner.address);
      let balanceFirstUserAfter = await BrickTokenInstance.balanceOf(signers.firstUser.address);

      expect(balanceOwnerAfter).to.equal(balanceOwnerBefore - transferAmount);
      expect(balanceFirstUserAfter).to.equal(balanceFirstUserBefore + balanceFirstUserAfter);
    })
  })
})