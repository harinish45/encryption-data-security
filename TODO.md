# ✅ Autonomous Implementation Checklist (Vibe Coding Guide)

This checklist is formatted for AI coding tools (Antigravity, Cursor, Claude Code, Copilot). Pick the first unchecked item `[ ]`, implement it with unit tests, verify, and mark as `[x]`.

---

## 🎯 Phase 1: Core Cryptographic Primitives
- [ ] `src/ciphers/aes_gcm.ts`: Implement `AES256GCMCipher` class
  - [ ] Implement `encrypt(plaintext: Buffer, key: Buffer): EncryptedResult`
  - [ ] Implement `decrypt(ciphertext: Buffer, key: Buffer, iv: Buffer, tag: Buffer): Buffer`
  - [ ] Auto-generate unique 12-byte cryptographically secure random IVs
  - [ ] Enforce constant-time tag comparison
  - [ ] Unit test: `tests/ciphers/aes_gcm.test.ts` (Valid enc/dec, corrupted tag throws, IV uniqueness)

- [ ] `src/ciphers/chacha20.ts`: Implement `ChaCha20Poly1305Cipher` class
  - [ ] Implement encryption, decryption, and authentication tag generation
  - [ ] Unit test: `tests/ciphers/chacha20.test.ts`

- [ ] `src/memory/zeroize.ts`: Memory buffer wiping
  - [ ] Implement `zeroizeBuffer(buf: Buffer): void` using `buf.fill(0)`
  - [ ] Unit test: `tests/memory/zeroize.test.ts`

## 🎯 Phase 2: Envelope Encryption Engine
- [ ] `src/envelope/envelope_engine.ts`: Envelope Encryption Engine
  - [ ] Generate ephemeral 256-bit DEK using `crypto.randomBytes(32)`
  - [ ] Encrypt data using DEK with AES-256-GCM
  - [ ] Call KMS Provider to wrap/unwrap DEK
  - [ ] Serialize into standardized JSON or binary envelope protocol
  - [ ] Unit test: `tests/envelope/envelope_engine.test.ts`

## 🎯 Phase 3: KMS Provider Integrations
- [ ] `src/kms/provider_interface.ts`: Define `IKMSProvider`
  - [ ] Method `generateDataKey(keyId: string): Promise<{ plaintextKey: Buffer, encryptedKey: Buffer }>`
  - [ ] Method `decryptDataKey(keyId: string, encryptedKey: Buffer): Promise<Buffer>`
- [ ] `src/kms/mock_provider.ts`: Local mock KMS provider for development and CI testing
  - [ ] Unit test: `tests/kms/mock_provider.test.ts`
- [ ] `src/kms/vault_provider.ts`: HashiCorp Vault transit engine adapter
- [ ] `src/kms/aws_kms_provider.ts`: AWS KMS client adapter

## 🎯 Phase 4: CI/CD & Security Auditing
- [ ] `.github/workflows/ci.yml`: Automated GitHub Actions pipeline
  - [ ] Type check with `tsc --noEmit`
  - [ ] Run test suite with coverage
  - [ ] Run secret scanner and lint checks
