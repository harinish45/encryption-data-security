import * as crypto from 'crypto';
import { IKMSProvider } from '../kms/provider_interface';
import { AES256GCMCipher } from '../ciphers/aes_gcm';
import { zeroizeBuffer } from '../memory/zeroize';

export interface EnvelopePackage {
  version: '1.0';
  keyId: string;
  encryptedDEK: string; // base64
  payload: {
    algorithm: 'AES-256-GCM';
    ciphertext: string;
    iv: string;
    tag: string;
  };
}

export class EnvelopeEncryptionEngine {
  private kmsProvider: IKMSProvider;
  private keyId: string;

  constructor(kmsProvider: IKMSProvider, keyId: string = 'default-master-key') {
    this.kmsProvider = kmsProvider;
    this.keyId = keyId;
  }

  public async encrypt(plaintext: Buffer): Promise<EnvelopePackage> {
    const { plaintextKey, encryptedKey } = await this.kmsProvider.generateDataKey(this.keyId);

    try {
      const payload = AES256GCMCipher.encrypt(plaintext, plaintextKey);
      return {
        version: '1.0',
        keyId: this.keyId,
        encryptedDEK: encryptedKey.toString('base64'),
        payload
      };
    } finally {
      zeroizeBuffer(plaintextKey);
    }
  }

  public async decrypt(envelope: EnvelopePackage): Promise<Buffer> {
    const encryptedKey = Buffer.from(envelope.encryptedDEK, 'base64');
    const plaintextKey = await this.kmsProvider.decryptDataKey(envelope.keyId, encryptedKey);

    try {
      return AES256GCMCipher.decrypt(envelope.payload, plaintextKey);
    } finally {
      zeroizeBuffer(plaintextKey);
    }
  }
}
