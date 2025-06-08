import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import '@nomicfoundation/hardhat-chai-matchers';

describe('Relayer Integration', () => {
  let relayer: Contract;
  let token: Contract;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0] as unknown as SignerWithAddress;
    user = signers[1] as unknown as SignerWithAddress;

    // Deploy test token
    const TokenFactory = await ethers.getContractFactory('MockERC20');
    token = await TokenFactory.deploy('Test Token', 'TEST');
    await token.deployed();

    // Deploy relayer
    const RelayerFactory = await ethers.getContractFactory('Relayer');
    relayer = await RelayerFactory.deploy(token.address);
    await relayer.deployed();

    // Mint tokens to user
    const amount = ethers.utils.parseEther('1000');
    await token.mint(await user.getAddress(), amount);
  });

  describe('Meta Transaction Submission', () => {
    it('should allow user to submit meta transaction', async () => {
      const amount = ethers.utils.parseEther('1.0');
      const deadline = (await getCurrentTimestamp()) + 3600; // 1 hour from now
      const nonce = await relayer.getNonce(await user.getAddress());
      
      // Create meta transaction data
      const data = token.interface.encodeFunctionData('transfer', [await user.getAddress(), amount]);
      
      // Sign meta transaction
      const domain = {
        name: 'CipherPay Relayer',
        version: '1',
        chainId: await ethers.provider.getNetwork().then(n => n.chainId),
        verifyingContract: relayer.address
      };
      
      const types = {
        MetaTransaction: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'data', type: 'bytes' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' }
        ]
      };
      
      const message = {
        from: await user.getAddress(),
        to: token.address,
        value: 0,
        data: data,
        nonce: nonce,
        deadline: deadline
      };
      
      const signature = await user.signTypedData(domain, types, message);
      
      // Submit meta transaction
      await expect(relayer.connect(owner.address).submitMetaTransaction(
        message.from,
        message.to,
        message.value,
        message.data,
        message.nonce,
        message.deadline,
        signature
      ))
        .to.emit(relayer, 'MetaTransactionExecuted')
        .withArgs(
          message.from,
          message.to,
          message.value,
          message.data,
          message.nonce,
          await getCurrentTimestamp()
        );
      
      // Check nonce was incremented
      expect(await relayer.getNonce(await user.getAddress())).to.equal(nonce.add(1));
    });

    it('should fail if signature is invalid', async () => {
      const amount = ethers.utils.parseEther('1.0');
      const deadline = (await getCurrentTimestamp()) + 3600;
      const nonce = await relayer.getNonce(await user.getAddress());
      
      const data = token.interface.encodeFunctionData('transfer', [await user.getAddress(), amount]);
      
      const domain = {
        name: 'CipherPay Relayer',
        version: '1',
        chainId: await ethers.provider.getNetwork().then(n => n.chainId),
        verifyingContract: relayer.address
      };
      
      const types = {
        MetaTransaction: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'data', type: 'bytes' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' }
        ]
      };
      
      const message = {
        from: await user.getAddress(),
        to: token.address,
        value: 0,
        data: data,
        nonce: nonce,
        deadline: deadline
      };
      
      const invalidSignature = '0x' + '1'.repeat(130); // Invalid signature
      
      await expect(relayer.connect(owner.address).submitMetaTransaction(
        message.from,
        message.to,
        message.value,
        message.data,
        message.nonce,
        message.deadline,
        invalidSignature
      ))
        .to.be.revertedWith('Invalid signature');
    });

    it('should fail if deadline has passed', async () => {
      const amount = ethers.utils.parseEther('1.0');
      const deadline = (await getCurrentTimestamp()) - 1; // Past deadline
      const nonce = await relayer.getNonce(await user.getAddress());
      
      const data = token.interface.encodeFunctionData('transfer', [await user.getAddress(), amount]);
      
      const domain = {
        name: 'CipherPay Relayer',
        version: '1',
        chainId: await ethers.provider.getNetwork().then(n => n.chainId),
        verifyingContract: relayer.address
      };
      
      const types = {
        MetaTransaction: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'data', type: 'bytes' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' }
        ]
      };
      
      const message = {
        from: await user.getAddress(),
        to: token.address,
        value: 0,
        data: data,
        nonce: nonce,
        deadline: deadline
      };
      
      const signature = await user.signTypedData(domain, types, message);
      
      await expect(relayer.connect(owner.address).submitMetaTransaction(
        message.from,
        message.to,
        message.value,
        message.data,
        message.nonce,
        message.deadline,
        signature
      ))
        .to.be.revertedWith('Transaction expired');
    });
  });

  describe('Fee Management', () => {
    it('should allow owner to update fee', async () => {
      const newFee = ethers.utils.parseEther('0.1');
      const oldFee = await relayer.fee();
      
      await expect(relayer.connect(owner.address).setFee(newFee))
        .to.emit(relayer, 'FeeUpdated')
        .withArgs(oldFee, newFee, await getCurrentTimestamp());
      
      expect(await relayer.fee()).to.equal(newFee);
    });

    it('should fail if non-owner tries to update fee', async () => {
      const newFee = ethers.utils.parseEther('0.1');
      
      await expect(relayer.connect(user.address).setFee(newFee))
        .to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should allow owner to withdraw fees', async () => {
      // First collect some fees
      const amount = ethers.utils.parseEther('1.0');
      const deadline = (await getCurrentTimestamp()) + 3600;
      const nonce = await relayer.getNonce(await user.getAddress());
      
      const data = token.interface.encodeFunctionData('transfer', [await user.getAddress(), amount]);
      
      const domain = {
        name: 'CipherPay Relayer',
        version: '1',
        chainId: await ethers.provider.getNetwork().then(n => n.chainId),
        verifyingContract: relayer.address
      };
      
      const types = {
        MetaTransaction: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'data', type: 'bytes' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' }
        ]
      };
      
      const message = {
        from: await user.getAddress(),
        to: token.address,
        value: 0,
        data: data,
        nonce: nonce,
        deadline: deadline
      };
      
      const signature = await user.signTypedData(domain, types, message);
      
      await relayer.connect(owner.address).submitMetaTransaction(
        message.from,
        message.to,
        message.value,
        message.data,
        message.nonce,
        message.deadline,
        signature
      );
      
      // Now withdraw fees
      const balanceBefore = await token.balanceOf(await owner.getAddress());
      const feeBalance = await token.balanceOf(relayer.address);
      
      await expect(relayer.connect(owner.address).withdrawFees())
        .to.emit(relayer, 'FeesWithdrawn')
        .withArgs(feeBalance, await getCurrentTimestamp());
      
      const balanceAfter = await token.balanceOf(await owner.getAddress());
      expect(balanceAfter.sub(balanceBefore)).to.equal(feeBalance);
      expect(await token.balanceOf(relayer.address)).to.equal(0);
    });
  });
});

async function getCurrentTimestamp(): Promise<number> {
  const block = await ethers.provider.getBlock('latest');
  return block.timestamp;
}
