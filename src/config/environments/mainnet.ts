import { EnvironmentConfig } from './index';
import { NETWORK, CONTRACT, ZK, MERKLE, RELAYER } from '../constants';

const config: EnvironmentConfig = {
  name: 'Mainnet',
  networkId: NETWORK.MAINNET,
  rpcUrl: process.env.MAINNET_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
  chainId: NETWORK.MAINNET,
  contracts: {
    shieldedVault: process.env.MAINNET_SHIELDED_VAULT_ADDRESS || CONTRACT.ZERO_ADDRESS,
    relayer: process.env.MAINNET_RELAYER_ADDRESS || CONTRACT.ZERO_ADDRESS,
    zkVerifier: process.env.MAINNET_ZKVERIFIER_ADDRESS || CONTRACT.ZERO_ADDRESS,
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
