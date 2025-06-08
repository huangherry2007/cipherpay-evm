# CipherPay EVM API Documentation

## Overview
CipherPay EVM provides a set of smart contracts and services for implementing privacy-preserving transactions on Ethereum. This document outlines the key interfaces and methods available for interacting with the system.

## Smart Contracts

### ShieldedVault
The main contract for managing private transactions.

#### Events
```solidity
event Deposit(bytes32 indexed commitment, uint256 amount, uint256 timestamp);
event Withdrawal(bytes32 indexed nullifier, address recipient, uint256 amount);
event Transfer(bytes32 indexed nullifier, bytes32 indexed commitment, uint256 amount);
event MerkleRootUpdated(bytes32 oldRoot, bytes32 newRoot);
```

#### Methods
```solidity
function deposit(bytes32 commitment, uint256 amount) external
function withdraw(
    bytes32[] calldata proof,
    bytes32 nullifier,
    bytes32 root,
    address recipient,
    uint256 amount
) external
function transfer(
    bytes32[] calldata proof,
    bytes32 nullifier,
    bytes32 commitment,
    bytes32 root,
    uint256 amount
) external
function getMerkleRoot() external view returns (bytes32)
function getBalance(bytes32 commitment) external view returns (uint256)
```

### ZKVerifier
Contract for verifying zero-knowledge proofs.

#### Methods
```solidity
function verifyProof(
    uint256[2] memory a,
    uint256[2][2] memory b,
    uint256[2] memory c,
    uint256[1] memory input
) external view returns (bool)
```

### Relayer
Contract for handling meta-transactions.

#### Events
```solidity
event MetaTransactionExecuted(
    address indexed user,
    address indexed relayer,
    bytes32 indexed transactionHash
);
```

#### Methods
```solidity
function executeMetaTransaction(
    address user,
    bytes calldata functionSignature,
    bytes32 sigR,
    bytes32 sigS,
    uint8 sigV
) external payable returns (bytes memory)
function getRelayerFee() external view returns (uint256)
function getTransactionStatus(bytes32 transactionHash) external view returns (bool)
```

## Services

### PrivacyService
Service for handling privacy-related operations.

#### Methods
```typescript
async generateProof(
    input: ProofInput
): Promise<ProofOutput>

async encryptNote(
    note: Note,
    publicKey: string
): Promise<EncryptedNote>

async decryptNote(
    encryptedNote: EncryptedNote,
    privateKey: string
): Promise<Note>

getConfig(): PrivacyConfig
```

### MerkleService
Service for managing the Merkle tree of commitments.

#### Methods
```typescript
async insert(commitment: string): Promise<void>
async generateProof(commitment: string): Promise<MerkleProof>
getRoot(): string
```

### RelayerService
Service for handling meta-transactions.

#### Methods
```typescript
async submitMetaTransaction(
    transaction: MetaTransaction
): Promise<TransactionResult>

async getRelayerFee(): Promise<BigNumber>
async getTransactionStatus(
    transactionHash: string
): Promise<boolean>
```

## Types

### Note
```typescript
interface Note {
    amount: BigNumber;
    nullifier: string;
    commitment: string;
    timestamp: number;
}
```

### ProofInput
```typescript
interface ProofInput {
    nullifier: string;
    commitment: string;
    amount: BigNumber;
    merkleRoot: string;
    merkleProof: string[];
}
```

### MetaTransaction
```typescript
interface MetaTransaction {
    from: string;
    to: string;
    value: BigNumber;
    data: string;
    nonce: number;
    gas: number;
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 1001 | Invalid proof |
| 1002 | Invalid nullifier |
| 1003 | Invalid commitment |
| 1004 | Insufficient balance |
| 1005 | Invalid merkle root |
| 2001 | Invalid signature |
| 2002 | Invalid nonce |
| 2003 | Insufficient relayer fee |
| 3001 | Invalid note format |
| 3002 | Encryption failed |
| 3003 | Decryption failed |

## Best Practices

1. Always verify proofs before executing transactions
2. Use the RelayerService for gasless transactions
3. Keep private keys secure and never expose them
4. Use the PrivacyService for all privacy-related operations
5. Monitor events for transaction status updates
6. Implement proper error handling for all service calls
7. Use the MerkleService for commitment management
8. Follow the recommended gas limits for each operation

## Security Considerations

1. All private keys should be stored securely
2. Proofs should be verified on-chain
3. Use the relayer for meta-transactions
4. Implement proper access control
5. Monitor for suspicious activity
6. Keep contracts and dependencies updated
7. Follow security best practices for key management
8. Implement proper error handling and recovery mechanisms
