import { BigNumber } from 'ethers';

export type CipherText = string;
export type PlainText = string;
export type PublicKey = string;
export type PrivateKey = string;

export interface EncryptionResult {
  ciphertext: CipherText;
  iv: string;
  tag: string;
}

export interface HashResult {
  hash: string;
  salt?: string;
}

export interface KeyPair {
  publicKey: PublicKey;
  privateKey: PrivateKey;
}

export interface ProofInputs {
  publicInputs: string[];
  privateInputs: string[];
}

export interface MerkleProof {
  root: string;
  siblings: string[];
  path: number[];
  leaf: string;
}

export interface NullifierData {
  nullifier: string;
  timestamp: number;
  token: string;
  amount: BigNumber;
}
