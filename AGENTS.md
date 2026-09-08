# 🤖 AI Agent Engineering Guidelines

When working in this repository:
1. **Never implement custom cryptography algorithms:** Always use Node.js standard `crypto` APIs or audited WebCrypto primitives.
2. **Always Zeroize Secrets:** Plaintext keys and unencrypted payloads must be zeroized (`buf.fill(0)`) in `finally` blocks.
3. **No Hardcoded Keys or IVs:** Never allow static IVs or nonces. Any nonce reuse in GCM mode is a critical vulnerability.
4. **Strict TypeScript Types:** No `any` types. All signatures must declare precise input/output types.
5. **Atomic Commits:** When completing a task from `TODO.md`, write the corresponding unit test, ensure `npm test` passes, and commit with conventional commit format (`feat: ...`, `fix: ...`, `test: ...`).
