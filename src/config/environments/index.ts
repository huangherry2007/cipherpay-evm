import { NETWORK } from '../constants';

export interface EnvironmentConfig {
  name: string;
  networkId: number;
  rpcUrl: string;
  chainId: number;
  contracts: {
    shieldedVault: string;
    relayer: string;
    zkVerifier: string;
  };
  gas: {
    defaultGasLimit: number;
    defaultGasPrice: string;
    maxGasLimit: number;
    minGasLimit: number;
  };
  relayer: {
    minFee: string;
    maxFee: string;
    feeMultiplier: number;
  };
  zk: {
    proofSize: number;
    publicInputsSize: number;
    circuitDepth: number;
  };
  merkle: {
    treeDepth: number;
    leafSize: number;
    rootSize: number;
  };
}

export type Environment = 'local' | 'testnet' | 'mainnet';

export const getEnvironmentConfig = (env: Environment): EnvironmentConfig => {
  switch (env) {
    case 'local':
      return require('./local').default;
    case 'testnet':
      return require('./testnet').default;
    case 'mainnet':
      return require('./mainnet').default;
    default:
      throw new Error(`Unknown environment: ${env}`);
  }
};
