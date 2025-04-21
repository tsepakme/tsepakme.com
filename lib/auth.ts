import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';

/**
 * Verifies the user credentials
 */
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  if (!username || !password) return false;
  
  const validUsername = process.env.ADMIN_USERNAME;
  const hashedPassword = process.env.ADMIN_PASSWORD_HASH;
  
  if (username !== validUsername) return false;
  
  return await bcrypt.compare(password, hashedPassword || '');
}

/**
 * Verifies a 2FA code
 */
export function verify2FACode(code: string): boolean {
  if (!code) return false;
  
  return speakeasy.totp.verify({
    secret: process.env.ADMIN_2FA_SECRET || '',
    encoding: 'base32',
    token: code,
    window: 1 // Allows small time discrepancies
  });
}

/**
 * Generates a password hash for storage
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

/**
 * Generates a new 2FA secret
 */
export function generate2FASecret(): { secret: string, qrCode: string } {
  const secret = speakeasy.generateSecret({
    name: process.env.NEXTAUTH_URL || 'Admin CMS'
  });
  
  return {
    secret: secret.base32,
    qrCode: secret.otpauth_url || ''
  };
}