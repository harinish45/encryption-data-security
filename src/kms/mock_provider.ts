import * as crypto from 'crypto';
import { IKMSProvider } from './provider_interface';

export class MockKMSProvider implements IKMSProvider {
  private masterKey: Buffer;

  constructor(masterKey?: Buffer) {
    this.masterKey = masterKey || crypto.randomBytes(32);
  }

  public async generateDataKey(_keyId: string): Promise<{ plaintextKey: Buffer; encryptedKey: Buffer }> {
    const plaintextKey = crypto.randomBytes(32);
    // Wrap DEK with master key using AES-256-KW or AES-256-GCM
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.masterKey, iv);
    const encryptedDEK = Buffer.concat([cipher.update(plaintextKey), cipher.final()]);
    const tag = cipher.getAuthTag();
    
    // Format: [IV(12)][Tag(16)][EncryptedDEK(32)]
    const encryptedKey = Buffer.concat([iv, tag, encryptedDEK]);

    return { plaintextKey, encryptedKey };
  }

  public async decryptDataKey(_keyId: string, encryptedKey: Buffer): Promise<Buffer> {
    const iv = encryptedKey.subarray(0, 12);
    const tag = encryptedKey.subarray(12, 28);
    const ciphertext = encryptedKey.subarray(28);

    const decipher = crypto.createDecipheriv('aes-256-gcm', this.masterKey, iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  }
}
