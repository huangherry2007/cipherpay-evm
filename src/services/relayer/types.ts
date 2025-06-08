export interface MetaTransaction {
  data: string;
  signature: string;
  nonce: number;
}

export interface RelayerResponse {
  txHash: string;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed';
  error?: string;
}
