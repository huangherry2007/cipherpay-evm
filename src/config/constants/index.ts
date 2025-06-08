import { ERRORS } from "./errors";

// Define types for our constants
type NetworkConfig = {
  MAINNET: number;
  GOERLI: number;
  SEPOLIA: number;
  HARDHAT: number;
};

type ContractConfig = {
  MAX_UINT256: string;
  ZERO_ADDRESS: string;
  DEFAULT_GAS_LIMIT: number;
  DEFAULT_GAS_PRICE: string;
  MAX_GAS_LIMIT: number;
  MIN_GAS_LIMIT: number;
  GAS_MULTIPLIER: number;
};

type ZKConfig = {
  PROOF_SIZE: number;
  PUBLIC_INPUTS_SIZE: number;
  CIRCUIT_DEPTH: number;
  FIELD_SIZE: string;
};

type MerkleConfig = {
  TREE_DEPTH: number;
  LEAF_SIZE: number;
  ROOT_SIZE: number;
  EMPTY_ROOT: string;
};

type TransactionConfig = {
  MAX_BATCH_SIZE: number;
  MAX_NONCE: number;
  DEFAULT_TIMEOUT: number;
  MIN_CONFIRMATIONS: number;
};

type RelayerConfig = {
  MIN_FEE: string;
  MAX_FEE: string;
  FEE_MULTIPLIER: number;
  MAX_RETRIES: number;
};

type GasConfig = {
  BASE_GAS: number;
  GAS_PER_BYTE: number;
  GAS_PER_NONCE: number;
  GAS_PER_SIGNATURE: number;
};

type Constants = {
  NETWORK: NetworkConfig;
  CONTRACT: ContractConfig;
  ZK: ZKConfig;
  MERKLE: MerkleConfig;
  TRANSACTION: TransactionConfig;
  RELAYER: RelayerConfig;
  GAS: GasConfig;
  ERRORS: typeof ERRORS;
};

export const CONSTANTS: Constants = {
  // Network Configuration
  NETWORK: {
    MAINNET: 1,
    GOERLI: 5,
    SEPOLIA: 11155111,
    HARDHAT: 31337,
  },

  // Contract Configuration
  CONTRACT: {
    MAX_UINT256: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    DEFAULT_GAS_LIMIT: 3000000,
    DEFAULT_GAS_PRICE: "50000000000", // 50 gwei
    MAX_GAS_LIMIT: 10000000,
    MIN_GAS_LIMIT: 21000,
    GAS_MULTIPLIER: 1.2,
  },

  // ZK Proof Configuration
  ZK: {
    PROOF_SIZE: 8, // Number of field elements in a proof
    PUBLIC_INPUTS_SIZE: 4, // Number of public inputs
    CIRCUIT_DEPTH: 32, // Depth of the circuit
    FIELD_SIZE: "21888242871839275222246405745257275088548364400416034343698204186575808495617",
  },

  // Merkle Tree Configuration
  MERKLE: {
    TREE_DEPTH: 32,
    LEAF_SIZE: 32, // Size of a leaf node in bytes
    ROOT_SIZE: 32, // Size of the root in bytes
    EMPTY_ROOT: "0x0000000000000000000000000000000000000000000000000000000000000000",
  },

  // Transaction Configuration
  TRANSACTION: {
    MAX_BATCH_SIZE: 100, // Maximum number of transactions in a batch
    MAX_NONCE: 2 ** 64 - 1, // Maximum nonce value
    DEFAULT_TIMEOUT: 3600, // Default transaction timeout in seconds
    MIN_CONFIRMATIONS: 1, // Minimum number of confirmations required
  },

  // Relayer Configuration
  RELAYER: {
    MIN_FEE: "100000000000000", // 0.0001 ETH
    MAX_FEE: "1000000000000000000", // 1 ETH
    FEE_MULTIPLIER: 1.1, // 10% fee multiplier
    MAX_RETRIES: 3, // Maximum number of retries for failed transactions
  },

  // Gas Configuration
  GAS: {
    BASE_GAS: 21000, // Base gas cost for a transaction
    GAS_PER_BYTE: 16, // Gas cost per byte of data
    GAS_PER_NONCE: 5000, // Gas cost per nonce increment
    GAS_PER_SIGNATURE: 10000, // Gas cost per signature verification
  },

  // Error Messages
  ERRORS,
};

// Export individual constants for easier access
export const {
  NETWORK,
  CONTRACT,
  ZK,
  MERKLE,
  TRANSACTION,
  RELAYER,
  GAS,
} = CONSTANTS;
