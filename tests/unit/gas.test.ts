import { ethers } from 'ethers';
import { expect } from 'chai';
import { GasService } from '../../src/services/gas';
import { GasConfig } from '../../src/types/services';

describe('GasService', () => {
  let gasService: GasService;
  let provider: ethers.providers.JsonRpcProvider;
  let config: GasConfig;

  beforeEach(() => {
    provider = new ethers.providers.JsonRpcProvider();
    config = {
      name: 'GasService',
      version: '1.0.0',
      environment: 'development',
      network: 'hardhat',
      chainId: 31337,
      maxGasLimit: 10000000,
      minGasLimit: 21000,
      gasMultiplier: 1.2,
      maxPriorityFeePerGas: 1500000000,
      maxFeePerGas: 30000000000
    };
    gasService = new GasService(provider);
  });

  describe('estimateGas', () => {
    it('should estimate gas for a simple transfer', async () => {
      const tx = {
        to: ethers.constants.AddressZero,
        value: ethers.utils.parseEther('1.0'),
        data: '0x'
      };

      const result = await gasService.estimateGas(tx);

      expect(result.estimatedGas).to.be.gt(0);
      expect(result.gasPrice).to.be.gt(0);
    });

    it('should handle contract interactions', async () => {
      const tx = {
        to: ethers.constants.AddressZero,
        data: '0x12345678'
      };

      const result = await gasService.estimateGas(tx);

      expect(result.estimatedGas).to.be.gt(0);
      expect(result.gasPrice).to.be.gt(0);
    });

    it('should respect max gas limit', async () => {
      const tx = {
        to: ethers.constants.AddressZero,
        data: '0x'.padEnd(1000000, '0') // Large data payload
      };

      const result = await gasService.estimateGas(tx);

      expect(result.estimatedGas).to.be.lte(config.maxGasLimit);
    });

    it('should respect min gas limit', async () => {
      const tx = {
        to: ethers.constants.AddressZero,
        value: ethers.utils.parseEther('0.1'),
        data: '0x'
      };

      const result = await gasService.estimateGas(tx);

      expect(result.estimatedGas).to.be.gte(config.minGasLimit);
    });
  });

  describe('getGasPrice', () => {
    it('should return current gas price', async () => {
      const gasPrice = await gasService.getGasPrice();

      expect(gasPrice).to.be.gt(0);
    });

    it('should handle network errors', async () => {
      // Mock provider to throw error
      const mockProvider = {
        getGasPrice: () => Promise.reject(new Error('Network error'))
      } as any;

      const errorService = new GasService(mockProvider);

      try {
        await errorService.getGasPrice();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });
  });

  describe('getBaseFee', () => {
    it('should return current base fee', async () => {
      const baseFee = await gasService.getBaseFee();

      expect(baseFee).to.be.gt(0);
    });

    it('should handle network errors', async () => {
      // Mock provider to throw error
      const mockProvider = {
        getFeeData: () => Promise.reject(new Error('Network error'))
      } as any;

      const errorService = new GasService(mockProvider);

      try {
        await errorService.getBaseFee();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });
  });
});
