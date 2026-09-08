export interface IKMSProvider {
  generateDataKey(keyId: string): Promise<{ plaintextKey: Buffer; encryptedKey: Buffer }>;
  decryptDataKey(keyId: string, encryptedKey: Buffer): Promise<Buffer>;
}
