import { ethers } from 'ethers';
import { GasEstimate } from './types';

/**
 * GasService estimates and manages gas for shielded transactions.
 */
export class GasService {
  private provider: ethers.providers.JsonRpcProvider;
  private readonly MAX_GAS_LIMIT = 10000000; // 10M gas
  private readonly MIN_GAS_LIMIT = 21000; // Base gas limit
  private readonly GAS_MULTIPLIER = 1.2; // 20% buffer

  constructor(provider: ethers.providers.JsonRpcProvider) {
    this.provider = provider;
  }

  /**
   * Estimates gas for a given transaction.
   * @param tx The transaction to estimate gas for
   * @returns GasEstimate object containing estimated gas and gas price
   */
  async estimateGas(tx: ethers.providers.TransactionRequest): Promise<GasEstimate> {
    try {
      // Get current gas price
      const gasPrice = await this.provider.getGasPrice();
      
      // Estimate gas limit
      let estimatedGasLimit: number;
      try {
        const gasEstimate = await this.provider.estimateGas(tx);
        estimatedGasLimit = gasEstimate.toNumber();
      } catch (error) {
        // If estimation fails, use a default value based on transaction type
        estimatedGasLimit = this.getDefaultGasLimit(tx);
      }

      // Apply gas multiplier for safety
      estimatedGasLimit = Math.ceil(estimatedGasLimit * this.GAS_MULTIPLIER);

      // Ensure gas limit is within bounds
      estimatedGasLimit = Math.min(
        Math.max(estimatedGasLimit, this.MIN_GAS_LIMIT),
        this.MAX_GAS_LIMIT
      );

      return {
        estimatedGas: estimatedGasLimit,
        gasPrice: gasPrice.toString(),
      };
    } catch (error) {
      throw new Error(`Failed to estimate gas: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets a default gas limit based on transaction type.
   * @param tx The transaction to get default gas limit for
   * @returns Default gas limit
   */
  private getDefaultGasLimit(tx: ethers.providers.TransactionRequest): number {
    // Base gas limit for simple transfers
    let gasLimit = this.MIN_GAS_LIMIT;

    // Add gas for contract interaction if data is present
    if (tx.data && tx.data !== '0x') {
      gasLimit += 21000; // Base contract interaction cost
      
      // Add gas for data length
      const dataLength = (tx.data.length - 2) / 2; // Remove '0x' prefix
      gasLimit += dataLength * 16; // 16 gas per byte of data
    }

    // Add gas for value transfer if present
    if (tx.value && ethers.BigNumber.from(tx.value).gt(0)) {
      gasLimit += 9000; // Additional cost for value transfer
    }

    return gasLimit;
  }

  /**
   * Gets the current network gas price.
   * @returns Current gas price in wei
   */
  async getGasPrice(): Promise<string> {
    try {
      const gasPrice = await this.provider.getGasPrice();
      return gasPrice.toString();
    } catch (error) {
      throw new Error(`Failed to get gas price: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets the current network base fee.
   * @returns Current base fee in wei
   */
  async getBaseFee(): Promise<string> {
    try {
      const block = await this.provider.getBlock('latest');
      if (!block) {
        throw new Error('Failed to get latest block');
      }
      return block.baseFeePerGas?.toString() || '0';
    } catch (error) {
      throw new Error(`Failed to get base fee: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
