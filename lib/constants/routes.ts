// Public routes (no auth required)
export const PUBLIC_ROUTES = [
  '/',
  '/pricing',
  '/demo',
  '/docs',
  '/about',
  '/blog',
  '/login',
  '/signup',
] as const;

// Auth routes
export const AUTH_ROUTES = {
  login: '/login',
  signup: '/signup',
  callback: '/api/auth/callback',
  logout: '/api/auth/logout',
} as const;

// Dashboard routes
export const DASHBOARD_ROUTES = {
  home: '/dashboard',
  defense: '/dashboard/defense',
  defenseText: '/dashboard/defense/text',
  defenseAudio: '/dashboard/defense/audio',
  redteam: '/dashboard/redteam',
  redteamNew: '/dashboard/redteam/new',
  redteamReports: '/dashboard/redteam/reports',
  apiKeys: '/dashboard/api-keys',
  usage: '/dashboard/usage',
  billing: '/dashboard/billing',
  team: '/dashboard/team',
  settings: '/dashboard/settings',
} as const;

// Admin routes
export const ADMIN_ROUTES = {
  home: '/admin',
  users: '/admin/users',
  organizations: '/admin/organizations',
  revenue: '/admin/revenue',
  usage: '/admin/usage',
  system: '/admin/system',
} as const;

// API routes
export const API_ROUTES = {
  defend: '/api/v1/defend',
  defendAudio: '/api/v1/defend/audio',
  redteam: '/api/v1/redteam',
  keys: '/api/keys',
  usage: '/api/usage',
  webhookStripe: '/api/webhooks/stripe',
} as const;

// Check if route is public
export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));
}

// Check if route is dashboard
export function isDashboardRoute(path: string): boolean {
  return path.startsWith('/dashboard');
}

// Check if route is admin
export function isAdminRoute(path: string): boolean {
  return path.startsWith('/admin');
}

// Check if route is API
export function isApiRoute(path: string): boolean {
  return path.startsWith('/api');
}
