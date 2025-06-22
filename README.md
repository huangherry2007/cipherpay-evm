# CipherPay EVM

A privacy-preserving payment system built on Ethereum that enables private transactions using zero-knowledge proofs and a Merkle tree-based commitment scheme.

## Features

- 🔒 Private transactions with zero-knowledge proofs
- 🌳 Merkle tree-based commitment scheme
- ⚡ Gasless transactions through meta-transactions
- 🔐 Secure note encryption and decryption
- 📊 Efficient state management
- 🛡️ Advanced security measures

## Zero-Knowledge Circuits

The EVM implementation supports all CipherPay circuits for comprehensive privacy-preserving operations:

### Core Circuits

#### Transfer Circuit (`verifier-transfer.json`)
- **Purpose**: Verifies private transfers between users
- **Smart Contract**: `TransferVerifier.sol`
- **Inputs**: Input notes, output notes, recipient, amount, fee
- **Outputs**: Proof validity, new commitments, nullifiers

#### Merkle Circuit (`verifier-merkle.json`)
- **Purpose**: Verifies Merkle tree membership proofs
- **Smart Contract**: `MerkleVerifier.sol`
- **Inputs**: Leaf commitment, Merkle path, root
- **Outputs**: Proof validity

#### Nullifier Circuit (`verifier-nullifier.json`)
- **Purpose**: Generates and verifies nullifiers for spent notes
- **Smart Contract**: `NullifierVerifier.sol`
- **Inputs**: Note commitment, secret
- **Outputs**: Nullifier hash

### Specialized Circuits

#### ZK Stream Circuit (`verifier-zkStream.json`)
- **Purpose**: Verifies streaming payments with time-based release
- **Smart Contract**: `StreamVerifier.sol`
- **Inputs**: Commitment, recipient, start/end times, current time, amount
- **Outputs**: Stream validity, release amount

#### ZK Split Circuit (`verifier-zkSplit.json`)
- **Purpose**: Verifies payment splitting among multiple recipients
- **Smart Contract**: `SplitVerifier.sol`
- **Inputs**: Input note, output notes, total amount
- **Outputs**: Split validity, individual amounts

#### ZK Condition Circuit (`verifier-zkCondition.json`)
- **Purpose**: Verifies conditional payments with various condition types
- **Smart Contract**: `ConditionVerifier.sol`
- **Inputs**: Commitment, condition type, condition data, recipient, amount
- **Outputs**: Condition validity, payment eligibility

### Utility Circuits

#### Audit Proof Circuit (`verifier-audit_proof.json`)
- **Purpose**: Generates audit proofs for compliance
- **Smart Contract**: `AuditVerifier.sol`
- **Inputs**: Notes, view key, total amount, timestamp
- **Outputs**: Audit proof validity

#### Withdraw Circuit (`verifier-withdraw.json`)
- **Purpose**: Verifies withdrawals from private to public addresses
- **Smart Contract**: `WithdrawVerifier.sol`
- **Inputs**: Input notes, recipient, amount, fee
- **Outputs**: Withdrawal validity, public transfer

### Circuit Integration

All circuits are integrated into the smart contracts using the following pattern:

```solidity
// Example: Transfer verification
contract TransferVerifier {
    function verifyTransfer(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[8] memory input
    ) public view returns (bool) {
        // Verify the zero-knowledge proof
        return verifier.verifyProof(a, b, c, input);
    }
}
```

### Circuit Files Location

Circuit verification keys are stored in `src/zk/circuits/`:
- `verifier-transfer.json`
- `verifier-merkle.json`
- `verifier-nullifier.json`
- `verifier-zkStream.json`
- `verifier-zkSplit.json`
- `verifier-zkCondition.json`
- `verifier-audit_proof.json`
- `verifier-withdraw.json`

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Hardhat
- Solidity (v0.8.0 or higher)
- TypeScript

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/cipherpay-evm.git
cd cipherpay-evm
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PRIVATE_KEY=your_private_key
ALCHEMY_API_KEY=your_alchemy_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Project Structure

```
cipherpay-evm/
├── contracts/           # Smart contracts
│   ├── ShieldedVault.sol
│   ├── ZKVerifier.sol
│   └── Relayer.sol
├── src/                # TypeScript source
│   ├── config/        # Configuration
│   ├── services/      # Core services
│   └── utils/         # Utilities
├── tests/             # Test files
│   ├── integration/   # Integration tests
│   └── unit/         # Unit tests
├── scripts/           # Deployment scripts
└── docs/             # Documentation
```

## Smart Contracts

### ShieldedVault
The main contract for managing private transactions and balances.

### ZKVerifier
Contract for verifying zero-knowledge proofs on-chain.

### Relayer
Contract for handling meta-transactions and gasless operations.

## Services

### PrivacyService
Handles privacy-related operations including proof generation and note encryption.

### MerkleService
Manages the Merkle tree state and generates proofs.

### RelayerService
Handles meta-transaction submission and fee management.

## Development

1. Compile contracts:
```bash
npx hardhat compile
```

2. Run tests:
```bash
npx hardhat test
```

3. Run linting:
```bash
npm run lint
```

4. Generate documentation:
```bash
npm run doc
```

## Deployment

### Local Development
```bash
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

### Testnet (Sepolia)
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

### Mainnet
```bash
npx hardhat run scripts/deploy.ts --network mainnet
```

## Verification

After deployment, verify contracts on Etherscan:
```bash
npx hardhat run scripts/verify.ts --network <network>
```

## Testing

### Unit Tests
```bash
npx hardhat test tests/unit
```

### Integration Tests
```bash
npx hardhat test tests/integration
```

## Documentation

- [API Documentation](docs/API.md)
- [Architecture Documentation](docs/ARCHITECTURE.md)

## Security

- All contracts are thoroughly tested
- Security best practices are followed
- Regular security audits are conducted
- Access control mechanisms are implemented
- Private keys are handled securely

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- [Hardhat](https://hardhat.org/)
- [Ethers.js](https://docs.ethers.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Solidity](https://docs.soliditylang.org/)