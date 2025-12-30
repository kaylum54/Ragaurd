import { z } from 'zod';

// API Key schemas
export const createApiKeySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and underscores'),
  scopes: z.array(z.enum(['defense:text', 'defense:audio', 'redteam'])).min(1, 'At least one scope is required'),
  expiresIn: z.enum(['30d', '90d', '1y', 'never']).optional(),
});

// Defense request schema
export const defendRequestSchema = z.object({
  input: z.string().min(1, 'Input is required').max(10000, 'Input must be less than 10000 characters'),
  profile: z.enum(['strict', 'balanced', 'permissive']).default('balanced'),
});

// Audio defense request schema
export const defendAudioRequestSchema = z.object({
  audio: z.string().min(1, 'Audio data is required'),
  format: z.enum(['wav', 'mp3', 'ogg', 'webm']).default('wav'),
});

// Red team scan schema
export const createScanSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  targetEndpoint: z.string().url('Must be a valid URL'),
  attackSuite: z.enum(['basic', 'standard', 'comprehensive', 'custom']).default('basic'),
  customAttacks: z.array(z.string()).optional(),
});

// Organization schema
export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
});

// Team member schema
export const inviteTeamMemberSchema = z.object({
  email: z.string().email('Must be a valid email'),
  role: z.enum(['admin', 'member', 'viewer']).default('member'),
});

// Settings schema
export const updateSettingsSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  billingEmail: z.string().email().optional(),
});

// Generic validation helper
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

// Safe validation that returns result instead of throwing
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type DefendRequestInput = z.infer<typeof defendRequestSchema>;
export type DefendAudioRequestInput = z.infer<typeof defendAudioRequestSchema>;
export type CreateScanInput = z.infer<typeof createScanSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type InviteTeamMemberInput = z.infer<typeof inviteTeamMemberSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
