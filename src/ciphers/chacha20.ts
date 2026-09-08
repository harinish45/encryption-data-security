import * as crypto from 'crypto';

export interface ChaCha20Payload {
  algorithm: 'ChaCha20-Poly1305';
  ciphertext: string; // base64
  iv: string;         // base64 (12 bytes)
  tag: string;        // base64 (16 bytes)
}

export class ChaCha20Poly1305Cipher {
  private static readonly ALGORITHM = 'chacha20-poly1305';
  private static readonly IV_LENGTH = 12;

  public static encrypt(plaintext: Buffer, key: Buffer, aad?: Buffer): ChaCha20Payload {
    if (key.length !== 32) {
      throw new Error('Key must be exactly 32 bytes (256 bits) for ChaCha20-Poly1305');
    }
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv, { authTagLength: 16 } as any);
    
    if (aad) {
      cipher.setAAD(aad);
    }

    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const tag = cipher.getAuthTag();

    return {
      algorithm: 'ChaCha20-Poly1305',
      ciphertext: ciphertext.toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64')
    };
  }

  public static decrypt(payload: ChaCha20Payload, key: Buffer, aad?: Buffer): Buffer {
    if (key.length !== 32) {
      throw new Error('Key must be exactly 32 bytes (256 bits) for ChaCha20-Poly1305');
    }
    const iv = Buffer.from(payload.iv, 'base64');
    const ciphertext = Buffer.from(payload.ciphertext, 'base64');
    const tag = Buffer.from(payload.tag, 'base64');

    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv, { authTagLength: 16 } as any);
    decipher.setAuthTag(tag);

    if (aad) {
      decipher.setAAD(aad);
    }

    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  }
}
