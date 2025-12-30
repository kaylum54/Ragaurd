// Demo admin credentials
// In production, this would be stored securely in a database with hashed passwords
export const DEMO_ADMIN = {
  email: 'admin@ragaurd.com',
  password: 'Ragaurd2024!',
  name: 'Admin User',
  role: 'admin' as const,
};

export const DEMO_USER = {
  email: 'demo@ragaurd.com',
  password: 'demo123',
  name: 'Demo User',
  role: 'user' as const,
};

export type UserRole = 'admin' | 'user';

export interface User {
  email: string;
  name: string;
  role: UserRole;
}

export function validateCredentials(email: string, password: string): User | null {
  if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
    return {
      email: DEMO_ADMIN.email,
      name: DEMO_ADMIN.name,
      role: DEMO_ADMIN.role,
    };
  }

  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    return {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      role: DEMO_USER.role,
    };
  }

  return null;
}
