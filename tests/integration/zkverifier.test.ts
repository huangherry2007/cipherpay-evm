import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import '@nomicfoundation/hardhat-chai-matchers';

describe('ZKVerifier Integration', () => {
  let verifier: Contract;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0] as unknown as SignerWithAddress;
    user = signers[1] as unknown as SignerWithAddress;

    // Deploy verifier
    const VerifierFactory = await ethers.getContractFactory('ZKVerifier');
    verifier = await VerifierFactory.deploy();
    await verifier.deployed();
  });

  describe('Proof Verification', () => {
    it('should verify valid proof', async () => {
      // Mock proof data
      const proof = {
        a: [BigNumber.from('1'), BigNumber.from('2')],
        b: [[BigNumber.from('3'), BigNumber.from('4')], [BigNumber.from('5'), BigNumber.from('6')]],
        c: [BigNumber.from('7'), BigNumber.from('8')],
        input: [BigNumber.from('9'), BigNumber.from('10')]
      };

      // Mock verification result
      const isValid = true;

      await expect(verifier.connect(user.address).verifyProof(
        proof.a,
        proof.b,
        proof.c,
        proof.input
      ))
        .to.emit(verifier, 'ProofVerified')
        .withArgs(isValid, await getCurrentTimestamp());
    });

    it('should reject invalid proof', async () => {
      // Mock invalid proof data
      const proof = {
        a: [BigNumber.from('0'), BigNumber.from('0')],
        b: [[BigNumber.from('0'), BigNumber.from('0')], [BigNumber.from('0'), BigNumber.from('0')]],
        c: [BigNumber.from('0'), BigNumber.from('0')],
        input: [BigNumber.from('0'), BigNumber.from('0')]
      };

      // Mock verification result
      const isValid = false;

      await expect(verifier.connect(user.address).verifyProof(
        proof.a,
        proof.b,
        proof.c,
        proof.input
      ))
        .to.emit(verifier, 'ProofVerified')
        .withArgs(isValid, await getCurrentTimestamp());
    });

    it('should fail if proof data is malformed', async () => {
      // Malformed proof data
      const proof = {
        a: [BigNumber.from('1')], // Missing second element
        b: [[BigNumber.from('3'), BigNumber.from('4')]], // Missing second array
        c: [BigNumber.from('7')], // Missing second element
        input: [BigNumber.from('9')] // Missing second element
      };

      await expect(verifier.connect(user.address).verifyProof(
        proof.a,
        proof.b,
        proof.c,
        proof.input
      ))
        .to.be.revertedWith('Invalid proof data');
    });
  });

  describe('Verification Key Management', () => {
    it('should allow owner to update verification key', async () => {
      const newKey = ethers.utils.keccak256(ethers.utils.randomBytes(32));
      const oldKey = await verifier.verificationKey();
      
      await expect(verifier.connect(owner.address).updateVerificationKey(newKey))
        .to.emit(verifier, 'VerificationKeyUpdated')
        .withArgs(oldKey, newKey, await getCurrentTimestamp());
      
      expect(await verifier.verificationKey()).to.equal(newKey);
    });

    it('should fail if non-owner tries to update verification key', async () => {
      const newKey = ethers.utils.keccak256(ethers.utils.randomBytes(32));
      
      await expect(verifier.connect(user.address).updateVerificationKey(newKey))
        .to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('Batch Verification', () => {
    it('should verify multiple proofs in batch', async () => {
      // Mock batch proof data
      const proofs = [
        {
          a: [BigNumber.from('1'), BigNumber.from('2')],
          b: [[BigNumber.from('3'), BigNumber.from('4')], [BigNumber.from('5'), BigNumber.from('6')]],
          c: [BigNumber.from('7'), BigNumber.from('8')],
          input: [BigNumber.from('9'), BigNumber.from('10')]
        },
        {
          a: [BigNumber.from('11'), BigNumber.from('12')],
          b: [[BigNumber.from('13'), BigNumber.from('14')], [BigNumber.from('15'), BigNumber.from('16')]],
          c: [BigNumber.from('17'), BigNumber.from('18')],
          input: [BigNumber.from('19'), BigNumber.from('20')]
        }
      ];

      // Mock verification results
      const results = [true, true];

      await expect(verifier.connect(user.address).verifyBatch(
        proofs.map(p => p.a),
        proofs.map(p => p.b),
        proofs.map(p => p.c),
        proofs.map(p => p.input)
      ))
        .to.emit(verifier, 'BatchVerified')
        .withArgs(results, await getCurrentTimestamp());
    });

    it('should fail if batch size exceeds limit', async () => {
      // Create array of proofs exceeding batch size limit
      const proofs = Array(101).fill({
        a: [BigNumber.from('1'), BigNumber.from('2')],
        b: [[BigNumber.from('3'), BigNumber.from('4')], [BigNumber.from('5'), BigNumber.from('6')]],
        c: [BigNumber.from('7'), BigNumber.from('8')],
        input: [BigNumber.from('9'), BigNumber.from('10')]
      });

      await expect(verifier.connect(user.address).verifyBatch(
        proofs.map(p => p.a),
        proofs.map(p => p.b),
        proofs.map(p => p.c),
        proofs.map(p => p.input)
      ))
        .to.be.revertedWith('Batch size too large');
    });
  });
});

async function getCurrentTimestamp(): Promise<number> {
  const block = await ethers.provider.getBlock('latest');
  return block.timestamp;
} 