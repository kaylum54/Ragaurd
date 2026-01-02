import { createHash, randomBytes, timingSafeEqual } from 'crypto';

// Simple password hashing using PBKDF2-like approach with SHA-256
// For production, consider using bcrypt or argon2
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const hash = await pbkdf2Hash(password, salt);
  return `${salt}:${hash}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;

    const inputHash = await pbkdf2Hash(password, salt);

    // Use timing-safe comparison to prevent timing attacks
    const inputBuffer = Buffer.from(inputHash, 'hex');
    const storedBuffer = Buffer.from(hash, 'hex');

    if (inputBuffer.length !== storedBuffer.length) return false;

    return timingSafeEqual(inputBuffer, storedBuffer);
  } catch {
    return false;
  }
}

async function pbkdf2Hash(password: string, salt: string): Promise<string> {
  // Simple PBKDF2-like implementation using multiple SHA-256 rounds
  let result = password + salt;

  for (let i = 0; i < ITERATIONS; i++) {
    result = createHash('sha256').update(result + salt).digest('hex');
  }

  return result.substring(0, KEY_LENGTH * 2); // Return hex string of KEY_LENGTH bytes
}
