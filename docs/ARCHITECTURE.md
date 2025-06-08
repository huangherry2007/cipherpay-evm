# CipherPay EVM Architecture

## System Overview
CipherPay EVM is a privacy-preserving payment system built on Ethereum that enables private transactions using zero-knowledge proofs and a Merkle tree-based commitment scheme.

## Architecture Components

### 1. Smart Contracts Layer
The foundation of the system consists of three main smart contracts:

#### ShieldedVault
- Manages private transactions and balances
- Implements the Merkle tree for commitment tracking
- Handles deposits, withdrawals, and transfers
- Enforces privacy through zero-knowledge proofs

#### ZKVerifier
- Verifies zero-knowledge proofs on-chain
- Ensures transaction validity without revealing sensitive data
- Implements the Groth16 verification scheme

#### Relayer
- Enables gasless transactions through meta-transactions
- Manages transaction fees and execution
- Provides transaction status tracking

### 2. Services Layer
A set of TypeScript services that provide high-level functionality:

#### PrivacyService
- Generates zero-knowledge proofs
- Handles note encryption and decryption
- Manages privacy configuration

#### MerkleService
- Maintains the Merkle tree state
- Generates Merkle proofs
- Handles commitment insertion and verification

#### RelayerService
- Manages meta-transaction submission
- Handles fee calculation and payment
- Provides transaction status monitoring

### 3. Data Structures

#### Note
```typescript
interface Note {
    amount: BigNumber;
    nullifier: string;
    commitment: string;
    timestamp: number;
}
```
- Represents a private transaction
- Contains amount and privacy-related data
- Used for encryption and proof generation

#### MerkleTree
- Binary tree structure for commitment storage
- Enables efficient proof generation
- Maintains privacy through commitment hashing

### 4. Privacy Mechanisms

#### Zero-Knowledge Proofs
- Proves transaction validity without revealing details
- Uses Groth16 proving system
- Verifies:
  - Amount consistency
  - Nullifier uniqueness
  - Commitment validity
  - Merkle tree inclusion

#### Commitment Scheme
- Hides transaction amounts and recipients
- Uses Pedersen commitments
- Enables private balance tracking

#### Nullifier System
- Prevents double-spending
- Ensures transaction uniqueness
- Maintains privacy while preventing fraud

### 5. Transaction Flow

1. **Deposit**
   - User creates a private note
   - Generates commitment
   - Submits deposit transaction
   - Commitment added to Merkle tree

2. **Transfer**
   - User generates zero-knowledge proof
   - Proves ownership and amount
   - Submits transfer transaction
   - Updates Merkle tree

3. **Withdrawal**
   - User generates withdrawal proof
   - Proves ownership and amount
   - Submits withdrawal transaction
   - Funds sent to recipient

### 6. Security Measures

#### Access Control
- Role-based permissions
- Relayer authorization
- Admin controls

#### Proof Verification
- On-chain verification
- Multiple proof types
- Gas optimization

#### State Management
- Merkle tree updates
- Commitment tracking
- Nullifier registry

### 7. Gas Optimization

#### Batch Processing
- Multiple commitments per transaction
- Optimized proof verification
- Efficient Merkle tree updates

#### Storage Optimization
- Minimal on-chain data
- Efficient commitment storage
- Optimized proof structure

### 8. Integration Points

#### Frontend Integration
- Web3 provider connection
- Transaction signing
- Event monitoring

#### Backend Integration
- Proof generation
- Note management
- State synchronization

#### External Services
- Relayer network
- Proof generation service
- Monitoring and analytics

## Deployment Architecture

### Local Development
- Hardhat network
- Mock token deployment
- Local testing environment

### Testnet
- Sepolia testnet
- Test token deployment
- Relayer configuration

### Mainnet
- Ethereum mainnet
- Production token integration
- Optimized gas settings

## Monitoring and Maintenance

### Event Monitoring
- Transaction events
- Error tracking
- State changes

### Health Checks
- Contract state verification
- Relayer status
- Proof verification

### Updates and Upgrades
- Contract upgrades
- Parameter updates
- Security patches

## Future Considerations

### Scalability
- Layer 2 integration
- Batch processing
- Gas optimization

### Privacy Enhancements
- Advanced proof systems
- Improved commitment schemes
- Enhanced nullifier system

### Integration
- Cross-chain compatibility
- Additional token support
- Enhanced relayer network
