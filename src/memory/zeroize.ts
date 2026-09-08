/**
 * Overwrite buffer memory with zeros to prevent sensitive data lingering in heap
 */
export function zeroizeBuffer(buf: Buffer): void {
  if (buf && Buffer.isBuffer(buf)) {
    buf.fill(0);
  }
}
