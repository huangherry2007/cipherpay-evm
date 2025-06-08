export * from './vault';

// Common contract types
export interface ContractConfig {
  address: string;
  network: string;
  chainId: number;
}

export interface ContractState {
  isInitialized: boolean;
  isPaused: boolean;
  lastUpdateTimestamp: number;
}

export interface ContractEvents {
  Paused: {
    account: string;
    timestamp: number;
  };
  Unpaused: {
    account: string;
    timestamp: number;
  };
  RoleGranted: {
    role: string;
    account: string;
    sender: string;
    timestamp: number;
  };
  RoleRevoked: {
    role: string;
    account: string;
    sender: string;
    timestamp: number;
  };
}
