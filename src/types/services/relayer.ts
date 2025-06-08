import { BigNumber } from 'ethers';
import { ContractConfig } from '../contracts';

/**
 * Configuration for the relayer service
 */
export interface RelayerConfig extends ContractConfig {
  maxRetries: number;
  retryDelay: number;
  minGasPrice: BigNumber;
  maxGasPrice: BigNumber;
  gasMultiplier: number;
}

/**
 * Response from a relayer operation
 */
export interface RelayerResponse {
  txHash: string;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed';
  error?: string;
}

/**
 * Gas estimation result
 */
export interface GasEstimate {
  estimatedGas: BigNumber;
  gasPrice: BigNumber;
  maxFeePerGas?: BigNumber;
  maxPriorityFeePerGas?: BigNumber;
}

/**
 * Transaction status details
 */
export interface TransactionStatus {
  hash: string;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed';
  blockNumber?: number;
  confirmations?: number;
  gasUsed?: BigNumber;
  effectiveGasPrice?: BigNumber;
  timestamp?: number;
}

/**
 * Relayer service state
 */
export interface RelayerState {
  isActive: boolean;
  lastProcessedBlock: number;
  totalTransactionsProcessed: number;
  totalGasUsed: BigNumber;
  lastUpdateTimestamp: number;
}

/**
 * Relayer service events
 */
export interface RelayerEvents {
  TransactionSubmitted: {
    txHash: string;
    sender: string;
    timestamp: number;
  };
  TransactionConfirmed: {
    txHash: string;
    blockNumber: number;
    timestamp: number;
  };
  TransactionFailed: {
    txHash: string;
    error: string;
    timestamp: number;
  };
  GasPriceUpdated: {
    oldPrice: BigNumber;
    newPrice: BigNumber;
    timestamp: number;
  };
}
