import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ShieldedVault } from "../../typechain-types";
import { BigNumber } from "ethers";
import '@nomicfoundation/hardhat-chai-matchers';

describe("ShieldedVault Integration", function () {
  let vault: ShieldedVault;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let token: Contract;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    owner = signers[0] as unknown as SignerWithAddress;
    user1 = signers[1] as unknown as SignerWithAddress;
    user2 = signers[2] as unknown as SignerWithAddress;

    // Deploy mock token
    const MockToken = await ethers.getContractFactory("MockToken");
    token = await MockToken.deploy("Mock Token", "MTK");
    await token.deployed();

    // Deploy ShieldedVault
    const ShieldedVault = await ethers.getContractFactory("ShieldedVault");
    vault = await ShieldedVault.deploy(token.address) as ShieldedVault;
    await vault.deployed();

    // Mint tokens to users
    await token.mint(user1.address, ethers.utils.parseEther("1000"));
    await token.mint(user2.address, ethers.utils.parseEther("1000"));
  });

  describe("Deposit", function () {
    it("should allow users to deposit tokens", async function () {
      const amount = ethers.utils.parseEther("100");
      await token.connect(user1.address).approve(vault.address, amount);
      await expect(vault.connect(user1.address).deposit(amount))
        .to.emit(vault, "Deposit")
        .withArgs(user1.address, amount);
    });

    it("should fail if user has insufficient balance", async function () {
      const amount = ethers.utils.parseEther("1000000");
      await token.connect(user1.address).approve(vault.address, amount);
      await expect(vault.connect(user1.address).deposit(amount))
        .to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });

  describe("Withdrawal", function () {
    it("should allow users to withdraw tokens", async function () {
      const amount = ethers.utils.parseEther("100");
      await token.connect(user1.address).approve(vault.address, amount);
      await vault.connect(user1.address).deposit(amount);

      await expect(vault.connect(user1.address).withdraw(amount))
        .to.emit(vault, "Withdrawal")
        .withArgs(user1.address, amount);
    });

    it("should fail if user has insufficient balance", async function () {
      const amount = ethers.utils.parseEther("1000000");
      await expect(vault.connect(user1.address).withdraw(amount))
        .to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Shielded Transfer", function () {
    it("should allow shielded transfers between users", async function () {
      const amount = ethers.utils.parseEther("100");
      await token.connect(user1.address).approve(vault.address, amount);
      await vault.connect(user1.address).deposit(amount);

      const proof = ethers.utils.randomBytes(32); // Mock proof
      await expect(vault.connect(user1.address).shieldedTransfer(amount, user2.address, proof))
        .to.emit(vault, "ShieldedTransfer")
        .withArgs(user1.address, user2.address, amount);
    });

    it("should fail if sender has insufficient balance", async function () {
      const amount = ethers.utils.parseEther("1000000");
      const proof = ethers.utils.randomBytes(32); // Mock proof
      await expect(vault.connect(user1.address).shieldedTransfer(amount, user2.address, proof))
        .to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Merkle Root Management", function () {
    it("should allow owner to update merkle root", async function () {
      const newRoot = ethers.utils.randomBytes(32);
      await expect(vault.connect(owner.address).updateMerkleRoot(newRoot))
        .to.emit(vault, "MerkleRootUpdated")
        .withArgs(newRoot);
    });

    it("should fail if non-owner tries to update merkle root", async function () {
      const newRoot = ethers.utils.randomBytes(32);
      await expect(vault.connect(user1.address).updateMerkleRoot(newRoot))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});

async function getCurrentTimestamp(): Promise<number> {
  const block = await ethers.provider.getBlock('latest');
  return block.timestamp;
}
