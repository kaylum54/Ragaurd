// Auth0 configuration
// Note: In production, use @auth0/nextjs-auth0 package

export const authConfig = {
  domain: process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '') || '',
  clientId: process.env.AUTH0_CLIENT_ID || '',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
  baseUrl: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
  secret: process.env.AUTH0_SECRET || '',
};

export function isAuthConfigured(): boolean {
  return !!(
    authConfig.domain &&
    authConfig.clientId &&
    authConfig.clientSecret &&
    authConfig.secret
  );
}
