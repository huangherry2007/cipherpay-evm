export const ERRORS = {
  // Contract Errors
  CONTRACT: {
    INVALID_TOKEN: "Invalid token address",
    INVALID_AMOUNT: "Amount must be greater than 0",
    INVALID_RECIPIENT: "Invalid recipient address",
    INVALID_PROOF: "Invalid zero-knowledge proof",
    INVALID_MERKLE_ROOT: "Invalid merkle root",
    INVALID_NULLIFIER: "Invalid nullifier",
    INVALID_COMMITMENT: "Invalid commitment",
    INSUFFICIENT_BALANCE: "Insufficient balance",
    TRANSFER_FAILED: "Transfer failed",
    NOT_INITIALIZED: "Contract not initialized",
    ALREADY_INITIALIZED: "Contract already initialized",
  },

  // Access Control Errors
  ACCESS: {
    NOT_OWNER: "Caller is not the owner",
    NOT_ADMIN: "Caller is not an admin",
    NOT_RELAYER: "Caller is not a relayer",
    NOT_AUTHORIZED: "Caller is not authorized",
  },

  // Transaction Errors
  TRANSACTION: {
    NULLIFIER_SPENT: "Nullifier already spent",
    COMMITMENT_EXISTS: "Commitment already exists",
    INVALID_SIGNATURE: "Invalid signature",
    EXPIRED_TRANSACTION: "Transaction has expired",
    INVALID_NONCE: "Invalid nonce",
    INSUFFICIENT_GAS: "Insufficient gas for transaction",
  },

  // ZK Proof Errors
  ZK: {
    INVALID_PROOF: "Invalid zero-knowledge proof",
    INVALID_PUBLIC_INPUTS: "Invalid public inputs",
    VERIFICATION_FAILED: "Proof verification failed",
    INVALID_CIRCUIT: "Invalid circuit configuration",
  },

  // Merkle Tree Errors
  MERKLE: {
    INVALID_PROOF: "Invalid merkle proof",
    INVALID_LEAF: "Invalid leaf node",
    INVALID_DEPTH: "Invalid tree depth",
    INVALID_INDEX: "Invalid leaf index",
  },

  // Relayer Errors
  RELAYER: {
    INVALID_FEE: "Invalid relayer fee",
    INSUFFICIENT_FEE: "Insufficient relayer fee",
    INVALID_META_TX: "Invalid meta-transaction",
    TRANSACTION_FAILED: "Transaction failed",
  },

  // Gas Errors
  GAS: {
    INSUFFICIENT_GAS: "Insufficient gas for transaction",
    GAS_PRICE_TOO_LOW: "Gas price too low",
    GAS_LIMIT_TOO_LOW: "Gas limit too low",
    GAS_LIMIT_TOO_HIGH: "Gas limit too high",
  },

  // Network Errors
  NETWORK: {
    INVALID_CHAIN_ID: "Invalid chain ID",
    UNSUPPORTED_NETWORK: "Unsupported network",
    RPC_ERROR: "RPC error occurred",
    TIMEOUT: "Request timed out",
  },
} as const;
