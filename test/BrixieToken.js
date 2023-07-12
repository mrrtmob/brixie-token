const { expect } = require("chai");
const hre = require("hardhat");

describe("BrixieToken contract", function () {
  // global vars
  let Token;
  let brixieToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Brixie");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    brixieToken = await Token.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await brixieToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await brixieToken.balanceOf(owner.address);
      expect(await brixieToken.totalSupply()).to.equal(ownerBalance);
    });
  });
  describe("Mint & Burn", function () {
    it("Should mint", async function () {
      await brixieToken.mint(owner.address, 1000);
      const ownerBalance = await brixieToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(1000);
    });

    it("Should Burn", async function () {
      await brixieToken.mint(owner.address, 1000);
      await brixieToken.burn(100);
      const totalSupply = await brixieToken.totalSupply();
      expect(totalSupply).to.equal(900);
    });
  });
  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await brixieToken.mint(owner.address, 1000);
      await brixieToken.transfer(addr1.address, 50);
      const addr1Balance = await brixieToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await brixieToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await brixieToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await brixieToken.balanceOf(owner.address);
      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      await expect(
        brixieToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await brixieToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      await brixieToken.mint(owner.address, 1000);
      const initialOwnerBalance = await brixieToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await brixieToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await brixieToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await brixieToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await brixieToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await brixieToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should not transfer token to yourself", async function () {
      await brixieToken.mint(addr1.address, 1000);
      await expect(
        brixieToken.connect(addr1).transfer(addr1.address, 100)
      ).to.be.revertedWith("Can not transfer token to yourself");
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      await brixieToken.transferOwnership(addr1.address);
      const potentialOwner = await brixieToken.potentialOwner();
      expect(potentialOwner).to.equal(addr1.address);
    });

    it("Should accept ownership", async function () {
      await brixieToken.connect(owner).transferOwnership(addr1.address);
      await brixieToken.connect(addr1).acceptNewOwner();
      owner = await brixieToken.owner();
      expect(owner).to.equal(addr1.address);
    });
  });
});
