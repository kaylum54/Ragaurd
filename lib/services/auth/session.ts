import { cookies } from 'next/headers';
import type { User } from '@/lib/auth';

interface SessionData {
  user: User;
  expires: number;
  orgId?: string;
}

// Demo org ID for development - will be replaced with real org lookup
const DEMO_ORG_ID = 'demo-org-001';

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return null;
    }

    const sessionData: SessionData = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    );

    // Check if session has expired
    if (Date.now() > sessionData.expires) {
      return null;
    }

    // Add demo org ID if not present
    if (!sessionData.orgId) {
      sessionData.orgId = DEMO_ORG_ID;
    }

    return sessionData;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function getCurrentOrgId(): Promise<string | null> {
  const session = await getSession();
  return session?.orgId || DEMO_ORG_ID;
}

export function getDemoOrgId(): string {
  return DEMO_ORG_ID;
}
