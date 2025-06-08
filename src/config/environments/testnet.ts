import { EnvironmentConfig } from './index';
import { NETWORK, CONTRACT, ZK, MERKLE, RELAYER } from '../constants';

const config: EnvironmentConfig = {
  name: 'Testnet',
  networkId: NETWORK.SEPOLIA, // Using Sepolia as the testnet
  rpcUrl: process.env.TESTNET_RPC_URL || 'https://rpc.sepolia.org',
  chainId: NETWORK.SEPOLIA,
  contracts: {
    shieldedVault: process.env.TESTNET_SHIELDED_VAULT_ADDRESS || CONTRACT.ZERO_ADDRESS,
    relayer: process.env.TESTNET_RELAYER_ADDRESS || CONTRACT.ZERO_ADDRESS,
    zkVerifier: process.env.TESTNET_ZKVERIFIER_ADDRESS || CONTRACT.ZERO_ADDRESS,
  },
  gas: {
    defaultGasLimit: CONTRACT.DEFAULT_GAS_LIMIT,
    defaultGasPrice: CONTRACT.DEFAULT_GAS_PRICE,
    maxGasLimit: CONTRACT.MAX_GAS_LIMIT,
    minGasLimit: CONTRACT.MIN_GAS_LIMIT,
  },
  relayer: {
    minFee: RELAYER.MIN_FEE,
    maxFee: RELAYER.MAX_FEE,
    feeMultiplier: RELAYER.FEE_MULTIPLIER,
  },
  zk: {
    proofSize: ZK.PROOF_SIZE,
    publicInputsSize: ZK.PUBLIC_INPUTS_SIZE,
    circuitDepth: ZK.CIRCUIT_DEPTH,
  },
  merkle: {
    treeDepth: MERKLE.TREE_DEPTH,
    leafSize: MERKLE.LEAF_SIZE,
    rootSize: MERKLE.ROOT_SIZE,
  },
};

export default config;
