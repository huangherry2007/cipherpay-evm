import { ethers } from 'ethers';
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import {
  CipherText,
  PlainText,
  PublicKey,
  PrivateKey,
  EncryptionResult,
  HashResult,
  KeyPair,
  ProofInputs,
  MerkleProof,
  NullifierData
} from './types';

/**
 * Generates a new key pair for encryption
 */
export const generateKeyPair = (): KeyPair => {
  const wallet = ethers.Wallet.createRandom();
  return {
    publicKey: wallet.publicKey,
    privateKey: wallet.privateKey,
  };
};

/**
 * Encrypts a plaintext message with a public key using AES-256-GCM
 */
export const encrypt = (message: PlainText, pubKey: PublicKey): EncryptionResult => {
  try {
    // Generate a random initialization vector
    const iv = randomBytes(16);
    
    // Derive a key from the public key
    const key = deriveKey(pubKey);
    
    // Create cipher
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    
    // Encrypt the message
    const encrypted = Buffer.concat([
      cipher.update(message, 'utf8'),
      cipher.final()
    ]);
    
    // Get the authentication tag
    const tag = cipher.getAuthTag();
    
    return {
      ciphertext: encrypted.toString('hex'),
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Decrypts a ciphertext message with a private key using AES-256-GCM
 */
export const decrypt = (
  cipherText: CipherText,
  iv: string,
  tag: string,
  privKey: PrivateKey
): PlainText => {
  try {
    // Derive the key from the private key
    const key = deriveKey(privKey);
    
    // Create decipher
    const decipher = createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(iv, 'hex')
    );
    
    // Set the authentication tag
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    // Decrypt the message
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(cipherText, 'hex')),
      decipher.final()
    ]);
    
    return decrypted.toString('utf8');
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Hashes a message using keccak256
 */
export const hash = (message: string): HashResult => {
  try {
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));
    return { hash };
  } catch (error) {
    throw new Error(`Hashing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generates a nullifier for a note
 */
export const generateNullifier = (note: string, privateKey: PrivateKey): string => {
  try {
    const message = `${note}:${privateKey}`;
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));
  } catch (error) {
    throw new Error(`Nullifier generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generates a commitment for a note
 */
export const generateCommitment = (note: string): string => {
  try {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(note));
  } catch (error) {
    throw new Error(`Commitment generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Derives an encryption key from a public or private key
 */
const deriveKey = (key: string): Buffer => {
  const salt = 'cipherpay-salt'; // In production, use a secure salt
  return scryptSync(key, salt, 32);
};

/**
 * Generates a Merkle proof for a leaf
 */
export const generateMerkleProof = (
  leaf: string,
  siblings: string[],
  path: number[]
): MerkleProof => {
  try {
    let current = leaf;
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i];
      const isLeft = path[i] === 0;
      
      if (isLeft) {
        current = ethers.utils.keccak256(
          ethers.utils.concat([
            ethers.utils.toUtf8Bytes(current),
            ethers.utils.toUtf8Bytes(sibling)
          ])
        );
      } else {
        current = ethers.utils.keccak256(
          ethers.utils.concat([
            ethers.utils.toUtf8Bytes(sibling),
            ethers.utils.toUtf8Bytes(current)
          ])
        );
      }
    }
    
    return {
      root: current,
      siblings,
      path,
      leaf
    };
  } catch (error) {
    throw new Error(`Merkle proof generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
