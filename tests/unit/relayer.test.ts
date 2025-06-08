import { ethers } from 'ethers';
import { expect } from 'chai';
import { RelayerService } from '../../src/services/relayer';
import { MetaTransaction } from '../../src/services/relayer/types';

describe('RelayerService', () => {
  let relayerService: RelayerService;
  let provider: ethers.providers.JsonRpcProvider;
  let relayerContract: ethers.Contract;
  let relayerAddress: string;

  beforeEach(() => {
    provider = new ethers.providers.JsonRpcProvider();
    relayerAddress = '0x1234567890123456789012345678901234567890';
    relayerContract = new ethers.Contract(
      relayerAddress,
      ['function getRelayerFee() view returns (uint256)'],
      provider
    );
    relayerService = new RelayerService(provider, relayerAddress, relayerContract);
  });

  describe('submitMetaTransaction', () => {
    it('should submit a meta-transaction successfully', async () => {
      const metaTx: MetaTransaction = {
        data: '0x12345678',
        signature: '0xabcdef',
        nonce: 1
      };

      const response = await relayerService.submitMetaTransaction(metaTx);

      expect(response).to.have.property('txHash');
      expect(response).to.have.property('status');
      expect(response.status).to.be.oneOf(['pending', 'submitted', 'confirmed', 'failed']);
    });

    it('should handle invalid meta-transaction', async () => {
      const invalidMetaTx = {
        data: 'invalid',
        signature: 'invalid',
        nonce: -1
      } as MetaTransaction;

      try {
        await relayerService.submitMetaTransaction(invalidMetaTx);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });

    it('should handle network errors', async () => {
      const metaTx: MetaTransaction = {
        data: '0x12345678',
        signature: '0xabcdef',
        nonce: 1
      };

      // Mock provider to throw error
      const mockProvider = {
        getSigner: () => ({
          sendTransaction: () => Promise.reject(new Error('Network error'))
        })
      } as any;

      const errorService = new RelayerService(
        mockProvider,
        relayerAddress,
        relayerContract
      );

      try {
        await errorService.submitMetaTransaction(metaTx);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });
  });

  describe('getRelayerFee', () => {
    it('should return current relayer fee', async () => {
      const fee = await relayerService.getRelayerFee();

      expect(fee).to.be.a('string');
      expect(fee).to.not.be.empty;
    });

    it('should handle contract errors', async () => {
      // Mock contract to throw error
      const mockContract = {
        getRelayerFee: () => Promise.reject(new Error('Contract error'))
      } as any;

      const errorService = new RelayerService(
        provider,
        relayerAddress,
        mockContract
      );

      try {
        await errorService.getRelayerFee();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });
  });

  describe('getTransactionStatus', () => {
    it('should return transaction status', async () => {
      const txHash = '0x1234567890abcdef';

      const status = await relayerService.getTransactionStatus(txHash);

      expect(status).to.have.property('txHash', txHash);
      expect(status).to.have.property('status');
      expect(status.status).to.be.oneOf(['pending', 'submitted', 'confirmed', 'failed']);
    });

    it('should handle invalid transaction hash', async () => {
      const invalidTxHash = 'invalid';

      try {
        await relayerService.getTransactionStatus(invalidTxHash);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });

    it('should handle network errors', async () => {
      const txHash = '0x1234567890abcdef';

      // Mock provider to throw error
      const mockProvider = {
        getTransactionReceipt: () => Promise.reject(new Error('Network error'))
      } as any;

      const errorService = new RelayerService(
        mockProvider,
        relayerAddress,
        relayerContract
      );

      try {
        await errorService.getTransactionStatus(txHash);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });
  });

  describe('getRelayerAddress', () => {
    it('should return relayer address', () => {
      const address = relayerService.getRelayerAddress();

      expect(address).to.equal(relayerAddress);
    });
  });
});
