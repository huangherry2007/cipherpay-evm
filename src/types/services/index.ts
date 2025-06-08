export * from './relayer';

// Common service types
export interface ServiceConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  network: string;
  chainId: number;
}

export interface ServiceState {
  isInitialized: boolean;
  isRunning: boolean;
  lastUpdateTimestamp: number;
  errorCount: number;
  warningCount: number;
}

export interface ServiceEvents {
  ServiceStarted: {
    timestamp: number;
    config: ServiceConfig;
  };
  ServiceStopped: {
    timestamp: number;
    reason?: string;
  };
  ErrorOccurred: {
    error: string;
    timestamp: number;
    severity: 'low' | 'medium' | 'high';
  };
  WarningIssued: {
    warning: string;
    timestamp: number;
    severity: 'low' | 'medium' | 'high';
  };
}

// Privacy service types
export interface PrivacyConfig extends ServiceConfig {
  zkProofSystem: 'groth16' | 'plonk' | 'halo2';
  encryptionAlgorithm: 'aes-256-gcm';
  merkleTreeDepth: number;
  nullifierSize: number;
}

export interface ZKProof {
  proof: string;
  publicInputs: string[];
  timestamp: number;
}

export interface EncryptedNote {
  ciphertext: string;
  iv: string;
  tag: string;
  timestamp: number;
}

// Gas service types
export interface GasConfig extends ServiceConfig {
  maxGasLimit: number;
  minGasLimit: number;
  gasMultiplier: number;
  maxPriorityFeePerGas: number;
  maxFeePerGas: number;
}

export interface GasEstimateResult {
  estimatedGas: number;
  gasPrice: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  timestamp: number;
}
