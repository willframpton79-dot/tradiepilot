import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTED_PREFIX = 'enc:';

function getKey(): Buffer | null {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) return null;
  return createHash('sha256').update(secret).digest();
}

export function encryptToken(plaintext: string): string {
  const key = getKey();
  if (!key || !plaintext) return plaintext;

  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, authTag, encrypted]);
  return ENCRYPTED_PREFIX + combined.toString('base64');
}

export function decryptToken(ciphertext: string): string {
  if (!ciphertext) return '';
  // Not prefixed — stored before encryption was added, return as-is
  if (!ciphertext.startsWith(ENCRYPTED_PREFIX)) return ciphertext;

  const key = getKey();
  if (!key) return ciphertext;

  try {
    const data = Buffer.from(ciphertext.slice(ENCRYPTED_PREFIX.length), 'base64');
    const iv = data.subarray(0, 12);
    const authTag = data.subarray(12, 28);
    const encrypted = data.subarray(28);
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    return decipher.update(encrypted) + decipher.final('utf8');
  } catch {
    // Decryption failed — value may be legacy plaintext
    return ciphertext;
  }
}
