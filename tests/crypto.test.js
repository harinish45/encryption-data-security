const assert = require('assert');
const test = require('node:test');
const crypto = require('crypto');

// Compile or test with native modules
test('AES-256-GCM Authenticated Encryption & Decryption', () => {
  const key = crypto.randomBytes(32);
  const secret = Buffer.from('Confidential Enterprise Security Payload 2026', 'utf8');

  // Encryption
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(secret), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Decryption
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

  assert.strictEqual(decrypted.toString('utf8'), secret.toString('utf8'));
});

test('ChaCha20-Poly1305 High-Speed Cipher with AAD', () => {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(12);
  const aad = Buffer.from('tenant_id=45;classification=RESTRICTED', 'utf8');
  const plaintext = Buffer.from('High-performance biometric payload', 'utf8');

  const cipher = crypto.createCipheriv('chacha20-poly1305', key, iv, { authTagLength: 16 });
  cipher.setAAD(aad);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  const decipher = crypto.createDecipheriv('chacha20-poly1305', key, iv, { authTagLength: 16 });
  decipher.setAAD(aad);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

  assert.strictEqual(decrypted.toString('utf8'), plaintext.toString('utf8'));
});

test('Envelope Encryption DEK Wrapping & Decryption', () => {
  const masterKey = crypto.randomBytes(32);
  const dek = crypto.randomBytes(32);
  const payload = Buffer.from('Sensitive Financial Record: Amount $1,500,000', 'utf8');

  // Wrap DEK
  const wrapIv = crypto.randomBytes(12);
  const wrapCipher = crypto.createCipheriv('aes-256-gcm', masterKey, wrapIv);
  const wrappedDEK = Buffer.concat([wrapCipher.update(dek), wrapCipher.final()]);
  const wrapTag = wrapCipher.getAuthTag();

  // Encrypt payload with DEK
  const dataIv = crypto.randomBytes(12);
  const dataCipher = crypto.createCipheriv('aes-256-gcm', dek, dataIv);
  const ciphertext = Buffer.concat([dataCipher.update(payload), dataCipher.final()]);
  const dataTag = dataCipher.getAuthTag();

  // Unwrap DEK
  const unwrapDecipher = crypto.createDecipheriv('aes-256-gcm', masterKey, wrapIv);
  unwrapDecipher.setAuthTag(wrapTag);
  const unwrappedDEK = Buffer.concat([unwrapDecipher.update(wrappedDEK), unwrapDecipher.final()]);
  assert.deepStrictEqual(unwrappedDEK, dek);

  // Decrypt payload with unwrapped DEK
  const dataDecipher = crypto.createDecipheriv('aes-256-gcm', unwrappedDEK, dataIv);
  dataDecipher.setAuthTag(dataTag);
  const decryptedData = Buffer.concat([dataDecipher.update(ciphertext), dataDecipher.final()]);

  assert.strictEqual(decryptedData.toString('utf8'), payload.toString('utf8'));
});

test('Memory Zeroization', () => {
  const buf = Buffer.from('secret-key-material-in-heap', 'utf8');
  assert.notStrictEqual(buf.toString('utf8'), '');
  buf.fill(0);
  assert.strictEqual(buf.every(byte => byte === 0), true);
});
