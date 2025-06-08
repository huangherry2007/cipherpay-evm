import { BigNumber } from 'ethers';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface TransactionValidation {
  amount: BigNumber;
  token: string;
  recipient: string;
  timestamp: number;
}

export interface ProofValidation {
  proof: string;
  publicInputs: string[];
  nullifier: string;
  commitment: string;
}

export interface CommitmentValidation {
  commitment: string;
  token: string;
  amount: BigNumber;
  timestamp: number;
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  value?: any;
}

export interface ValidationOptions {
  strictMode?: boolean;
  allowZeroAmount?: boolean;
  maxAmount?: BigNumber;
  minAmount?: BigNumber;
  allowedTokens?: string[];
  maxTimestamp?: number;
  minTimestamp?: number;
}
