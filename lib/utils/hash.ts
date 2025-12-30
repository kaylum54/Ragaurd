import { createHash, randomBytes } from 'crypto';

export interface GeneratedApiKey {
  key: string;
  prefix: string;
  hash: string;
}

/**
 * Generate a new API key with prefix and hash
 * The actual key is shown ONCE to the user, then only the hash is stored
 */
export function generateApiKey(): GeneratedApiKey {
  const random = randomBytes(32).toString('hex');
  const key = `rg_live_${random}`;
  return {
    key,
    prefix: key.substring(0, 15) + '...',
    hash: createHash('sha256').update(key).digest('hex'),
  };
}

/**
 * Hash an API key for lookup
 */
export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

/**
 * Validate API key format
 */
export function isValidApiKeyFormat(key: string): boolean {
  return /^rg_(live|test)_[a-f0-9]{64}$/.test(key);
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Generate a webhook signing secret
 */
export function generateWebhookSecret(): string {
  return `whsec_${randomBytes(32).toString('hex')}`;
}
