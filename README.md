# CipherPay EVM

A privacy-preserving payment system built on Ethereum that enables private transactions using zero-knowledge proofs and a Merkle tree-based commitment scheme.

## Features

- 🔒 Private transactions with zero-knowledge proofs
- 🌳 Merkle tree-based commitment scheme
- ⚡ Gasless transactions through meta-transactions
- 🔐 Secure note encryption and decryption
- 📊 Efficient state management
- 🛡️ Advanced security measures

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