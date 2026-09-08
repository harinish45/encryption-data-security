import * as crypto from 'crypto';

export interface EncryptedPayload {
  algorithm: 'AES-256-GCM';
  ciphertext: string; // base64
  iv: string;         // base64
  tag: string;        // base64
}

export class AES256GCMCipher {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 12; // 96 bits recommended for GCM

  public static encrypt(plaintext: Buffer, key: Buffer): EncryptedPayload {
    if (key.length !== 32) {
      throw new Error('Key must be exactly 32 bytes (256 bits) for AES-256-GCM');
    }
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
    
    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const tag = cipher.getAuthTag();

    return {
      algorithm: 'AES-256-GCM',
      ciphertext: ciphertext.toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64')
    };
  }

  public static decrypt(payload: EncryptedPayload, key: Buffer): Buffer {
    if (key.length !== 32) {
      throw new Error('Key must be exactly 32 bytes (256 bits) for AES-256-GCM');
    }
    const iv = Buffer.from(payload.iv, 'base64');
    const ciphertext = Buffer.from(payload.ciphertext, 'base64');
    const tag = Buffer.from(payload.tag, 'base64');

    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  }
}
