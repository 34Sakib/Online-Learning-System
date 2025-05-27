// Simple in-memory blacklist for JWT tokens
// In production, use Redis or database for persistence

const blacklistedTokens = new Set<string>();

export function blacklistToken(token: string) {
  blacklistedTokens.add(token);
}

export function isTokenBlacklisted(token: string): boolean {
  return blacklistedTokens.has(token);
}
