import { BigNumber } from 'ethers';

/**
 * Represents a shielded note in the vault
 */
export interface ShieldedNote {
  owner: string;
  amount: BigNumber;
  token: string;
  commitment: string;
  nullifier: string;
  timestamp: number;
}

/**
 * Represents a deposit transaction
 */
export interface DepositTransaction {
  token: string;
  amount: BigNumber;
  commitment: string;
  timestamp: number;
}

/**
 * Represents a withdrawal transaction
 */
export interface WithdrawalTransaction {
  token: string;
  amount: BigNumber;
  recipient: string;
  nullifier: string;
  proof: string;
  timestamp: number;
}

/**
 * Represents a shielded transfer transaction
 */
export interface ShieldedTransferTransaction {
  token: string;
  amount: BigNumber;
  recipient: string;
  nullifier: string;
  newCommitment: string;
  proof: string;
  timestamp: number;
}

/**
 * Represents the state of a note in the vault
 */
export interface NoteState {
  isSpent: boolean;
  isNullified: boolean;
  lastUpdateTimestamp: number;
}

/**
 * Represents the configuration for the vault
 */
export interface VaultConfig {
  maxDepositAmount: BigNumber;
  maxWithdrawalAmount: BigNumber;
  maxTransferAmount: BigNumber;
  minDepositAmount: BigNumber;
  minWithdrawalAmount: BigNumber;
  minTransferAmount: BigNumber;
  merkleTreeDepth: number;
  nullifierRegistrySize: number;
}

/**
 * Represents the events emitted by the vault
 */
export interface VaultEvents {
  Deposit: {
    token: string;
    amount: BigNumber;
    commitment: string;
    timestamp: number;
  };
  Withdrawal: {
    token: string;
    amount: BigNumber;
    recipient: string;
    nullifier: string;
    timestamp: number;
  };
  ShieldedTransfer: {
    token: string;
    amount: BigNumber;
    recipient: string;
    nullifier: string;
    newCommitment: string;
    timestamp: number;
  };
  MerkleRootUpdated: {
    oldRoot: string;
    newRoot: string;
    timestamp: number;
  };
}
