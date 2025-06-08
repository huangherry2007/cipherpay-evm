import { ethers } from 'ethers';
import { expect } from 'chai';
import { PrivacyService } from '../../src/services/privacy';
import { PrivacyConfig } from '../../src/services/privacy/types';

describe('PrivacyService', () => {
  let privacyService: PrivacyService;
  let config: PrivacyConfig;

  beforeEach(() => {
    config = {
      minDelay: 0,
      maxDelay: 86400,
      mixingEnabled: true
    };
    privacyService = new PrivacyService(config);
  });

  describe('generateProof', () => {
    it('should generate a valid proof', async () => {
      const inputs = {
        amount: '1000000000000000000',
        nullifier: '0x1234567890abcdef',
        merkleRoot: '0xabcdef1234567890',
        commitment: '0x9876543210fedcba',
        privateKey: '0x1234567890abcdef'
      };

      const proof = await privacyService.generateProof(inputs);

      expect(proof).to.be.a('string');
      expect(proof).to.not.be.empty;
    });

    it('should handle invalid inputs', async () => {
      try {
        await privacyService.generateProof(null as any);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });
  });

  describe('encryptNote', () => {
    it('should encrypt a note successfully', async () => {
      const note = 'test note';
      const publicKey = '0x1234567890abcdef';

      const encrypted = await privacyService.encryptNote(note, publicKey);

      expect(encrypted).to.be.a('string');
      expect(encrypted).to.not.equal(note);
    });

    it('should handle empty note', async () => {
      const note = '';
      const publicKey = '0x1234567890abcdef';

      const encrypted = await privacyService.encryptNote(note, publicKey);

      expect(encrypted).to.be.a('string');
      expect(encrypted).to.not.equal(note);
    });

    it('should handle invalid inputs', async () => {
      try {
        await privacyService.encryptNote(null as any, '0x123');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });
  });

  describe('decryptNote', () => {
    it('should decrypt an encrypted note successfully', async () => {
      const originalNote = 'test note';
      const publicKey = '0x1234567890abcdef';
      const privateKey = '0xabcdef1234567890';

      const encrypted = await privacyService.encryptNote(originalNote, publicKey);
      const decrypted = await privacyService.decryptNote(encrypted, privateKey);

      expect(decrypted).to.equal(originalNote);
    });

    it('should handle invalid encryption', async () => {
      const invalidEncrypted = 'invalid';

      try {
        await privacyService.decryptNote(invalidEncrypted, '0x123');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });

    it('should handle invalid inputs', async () => {
      try {
        await privacyService.decryptNote(null as any, '0x123');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });
  });

  describe('getConfig', () => {
    it('should return current configuration', () => {
      const currentConfig = privacyService.getConfig();

      expect(currentConfig).to.deep.equal(config);
    });
  });
});
