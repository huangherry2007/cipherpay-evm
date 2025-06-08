import { ethers } from 'ethers';
import { MetaTransaction, RelayerResponse } from './types';
import { GasService } from '../gas';

/**
 * RelayerService handles meta-transaction submission and relayer fee logic.
 */
export class RelayerService {
  private provider: ethers.providers.JsonRpcProvider;
  private relayerAddress: string;
  private relayerContract: ethers.Contract;
  private gasService: GasService;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor(
    provider: ethers.providers.JsonRpcProvider,
    relayerAddress: string,
    relayerContract: ethers.Contract
  ) {
    this.provider = provider;
    this.relayerAddress = relayerAddress;
    this.relayerContract = relayerContract;
    this.gasService = new GasService(provider);
  }

  /**
   * Submits a meta-transaction to the relayer contract.
   * @param metaTx The meta-transaction to submit
   * @returns The transaction response
   */
  async submitMetaTransaction(metaTx: MetaTransaction): Promise<RelayerResponse> {
    try {
      // Get the current relayer fee
      const fee = await this.getRelayerFee();

      // Prepare the transaction
      const tx = await this.prepareTransaction(metaTx, fee);

      // Submit the transaction with retries
      const response = await this.submitWithRetry(tx);

      return {
        txHash: response.hash,
        status: 'submitted',
      };
    } catch (error) {
      throw new Error(`Failed to submit meta-transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets the current relayer fee from the contract.
   * @returns The current relayer fee
   */
  async getRelayerFee(): Promise<string> {
    try {
      const fee = await this.relayerContract.getRelayerFee();
      return fee.toString();
    } catch (error) {
      throw new Error(`Failed to get relayer fee: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Prepares a transaction for submission.
   * @param metaTx The meta-transaction to prepare
   * @param fee The relayer fee
   * @returns The prepared transaction
   */
  private async prepareTransaction(
    metaTx: MetaTransaction,
    fee: string
  ): Promise<ethers.providers.TransactionRequest> {
    // Encode the meta-transaction data
    const data = this.relayerContract.interface.encodeFunctionData(
      'submitMetaTransaction',
      [metaTx.data, fee]
    );

    // Get gas estimate
    const gasEstimate = await this.gasService.estimateGas({
      to: this.relayerContract.address,
      data,
      value: fee,
    });

    return {
      to: this.relayerContract.address,
      data,
      value: fee,
      gasLimit: gasEstimate.estimatedGas,
      gasPrice: gasEstimate.gasPrice,
    };
  }

  /**
   * Submits a transaction with retry logic.
   * @param tx The transaction to submit
   * @returns The transaction response
   */
  private async submitWithRetry(
    tx: ethers.providers.TransactionRequest
  ): Promise<ethers.providers.TransactionResponse> {
    let lastError: Error | null = null;

    for (let i = 0; i < this.MAX_RETRIES; i++) {
      try {
        // Get the signer
        const signer = this.provider.getSigner(this.relayerAddress);

        // Submit the transaction
        const response = await signer.sendTransaction(tx);

        // Wait for the transaction to be mined
        await response.wait();

        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // If this is not the last retry, wait before trying again
        if (i < this.MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        }
      }
    }

    throw lastError || new Error('Failed to submit transaction after retries');
  }

  /**
   * Gets the transaction status.
   * @param txHash The transaction hash
   * @returns The transaction status
   */
  async getTransactionStatus(txHash: string): Promise<RelayerResponse> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        return {
          txHash,
          status: 'pending',
        };
      }

      return {
        txHash,
        status: receipt.status ? 'confirmed' : 'failed',
      };
    } catch (error) {
      throw new Error(`Failed to get transaction status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets the relayer contract address.
   * @returns The relayer contract address
   */
  getRelayerAddress(): string {
    return this.relayerAddress;
  }
}
