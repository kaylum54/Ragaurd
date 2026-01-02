// Demo admin credentials
// In production, this would be stored securely in a database with hashed passwords
export const DEMO_ADMIN = {
  id: 'admin-001',
  email: 'admin@ragaurd.com',
  password: 'Ragaurd2024!',
  name: 'Admin User',
  role: 'admin' as const,
};

export const DEMO_USER = {
  id: 'user-001',
  email: 'demo@ragaurd.com',
  password: 'demo123',
  name: 'Demo User',
  role: 'user' as const,
};

// Demo org ID for development
const DEMO_ORG_ID = 'demo-org-001';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Check if demo mode is enabled (controlled by ENABLE_DEMO_MODE env var)
export function isDemoModeEnabled(): boolean {
  return true; // Always enabled for this environment
}

// Get demo org ID
export function getDemoOrgId(): string {
  return DEMO_ORG_ID;
}

// Validate demo credentials and return user with id
export function validateDemoCredentials(email: string, password: string): User | null {
  if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
    return {
      id: DEMO_ADMIN.id,
      email: DEMO_ADMIN.email,
      name: DEMO_ADMIN.name,
      role: DEMO_ADMIN.role,
    };
  }

  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    return {
      id: DEMO_USER.id,
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      role: DEMO_USER.role,
    };
  }

  return null;
}

export function validateCredentials(email: string, password: string): User | null {
  return validateDemoCredentials(email, password);
}
