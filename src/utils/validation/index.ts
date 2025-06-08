import { ethers } from 'ethers';
import {
  ValidationResult,
  TransactionValidation,
  ProofValidation,
  CommitmentValidation,
  ValidationError,
  ValidationOptions
} from './types';

/**
 * Validates a transaction object
 */
export const validateTransaction = (
  tx: TransactionValidation,
  options: ValidationOptions = {}
): ValidationResult => {
  try {
    // Validate amount
    if (!options.allowZeroAmount && tx.amount.isZero()) {
      return {
        valid: false,
        error: 'Amount cannot be zero'
      };
    }

    if (options.maxAmount && tx.amount.gt(options.maxAmount)) {
      return {
        valid: false,
        error: `Amount exceeds maximum allowed: ${options.maxAmount.toString()}`
      };
    }

    if (options.minAmount && tx.amount.lt(options.minAmount)) {
      return {
        valid: false,
        error: `Amount below minimum allowed: ${options.minAmount.toString()}`
      };
    }

    // Validate token
    if (options.allowedTokens && !options.allowedTokens.includes(tx.token)) {
      return {
        valid: false,
        error: `Token not allowed: ${tx.token}`
      };
    }

    // Validate recipient
    if (!ethers.utils.isAddress(tx.recipient)) {
      return {
        valid: false,
        error: 'Invalid recipient address'
      };
    }

    // Validate timestamp
    const now = Math.floor(Date.now() / 1000);
    if (options.maxTimestamp && tx.timestamp > options.maxTimestamp) {
      return {
        valid: false,
        error: 'Transaction timestamp is in the future'
      };
    }

    if (options.minTimestamp && tx.timestamp < options.minTimestamp) {
      return {
        valid: false,
        error: 'Transaction timestamp is too old'
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Validates a zero-knowledge proof
 */
export const validateProof = (
  proof: ProofValidation,
  options: ValidationOptions = {}
): ValidationResult => {
  try {
    // Validate proof format
    if (!proof.proof || typeof proof.proof !== 'string') {
      return {
        valid: false,
        error: 'Invalid proof format'
      };
    }

    // Validate public inputs
    if (!Array.isArray(proof.publicInputs) || proof.publicInputs.length === 0) {
      return {
        valid: false,
        error: 'Invalid public inputs'
      };
    }

    // Validate nullifier
    if (!proof.nullifier || typeof proof.nullifier !== 'string') {
      return {
        valid: false,
        error: 'Invalid nullifier'
      };
    }

    // Validate commitment
    if (!proof.commitment || typeof proof.commitment !== 'string') {
      return {
        valid: false,
        error: 'Invalid commitment'
      };
    }

    // Additional validation in strict mode
    if (options.strictMode) {
      // Validate proof length
      if (proof.proof.length !== 66) { // Example length for a specific proof system
        return {
          valid: false,
          error: 'Invalid proof length'
        };
      }

      // Validate nullifier format
      if (!/^0x[a-fA-F0-9]{64}$/.test(proof.nullifier)) {
        return {
          valid: false,
          error: 'Invalid nullifier format'
        };
      }

      // Validate commitment format
      if (!/^0x[a-fA-F0-9]{64}$/.test(proof.commitment)) {
        return {
          valid: false,
          error: 'Invalid commitment format'
        };
      }
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `Proof validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Validates a commitment string
 */
export const validateCommitment = (
  commitment: CommitmentValidation,
  options: ValidationOptions = {}
): ValidationResult => {
  try {
    // Validate commitment format
    if (!commitment.commitment || typeof commitment.commitment !== 'string') {
      return {
        valid: false,
        error: 'Invalid commitment format'
      };
    }

    // Validate token
    if (options.allowedTokens && !options.allowedTokens.includes(commitment.token)) {
      return {
        valid: false,
        error: `Token not allowed: ${commitment.token}`
      };
    }

    // Validate amount
    if (!options.allowZeroAmount && commitment.amount.isZero()) {
      return {
        valid: false,
        error: 'Amount cannot be zero'
      };
    }

    if (options.maxAmount && commitment.amount.gt(options.maxAmount)) {
      return {
        valid: false,
        error: `Amount exceeds maximum allowed: ${options.maxAmount.toString()}`
      };
    }

    if (options.minAmount && commitment.amount.lt(options.minAmount)) {
      return {
        valid: false,
        error: `Amount below minimum allowed: ${options.minAmount.toString()}`
      };
    }

    // Validate timestamp
    const now = Math.floor(Date.now() / 1000);
    if (options.maxTimestamp && commitment.timestamp > options.maxTimestamp) {
      return {
        valid: false,
        error: 'Commitment timestamp is in the future'
      };
    }

    if (options.minTimestamp && commitment.timestamp < options.minTimestamp) {
      return {
        valid: false,
        error: 'Commitment timestamp is too old'
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `Commitment validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
