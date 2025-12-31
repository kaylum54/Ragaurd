/**
 * Safe error logging utilities
 * Prevents sensitive information leakage in production logs
 */

interface SafeErrorInfo {
  message: string;
  code?: string | number;
  name?: string;
}

/**
 * Extract safe error information for logging
 * Strips stack traces and other potentially sensitive details
 */
export function getSafeErrorInfo(error: unknown): SafeErrorInfo {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      code: (error as Error & { code?: string | number }).code,
    };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    return {
      message: String(err.message || 'Unknown error'),
      code: err.code as string | number | undefined,
    };
  }

  return { message: 'Unknown error' };
}

/**
 * Log an error safely without exposing sensitive information
 * Use this instead of console.error(error) for API errors
 */
export function logError(context: string, error: unknown): void {
  const safeInfo = getSafeErrorInfo(error);

  if (process.env.NODE_ENV === 'development') {
    // In development, log full error for debugging
    console.error(`${context}:`, error);
  } else {
    // In production, log only safe info
    console.error(`${context}:`, safeInfo);
  }
}
