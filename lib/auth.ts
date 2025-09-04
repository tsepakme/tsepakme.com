import bcrypt from 'bcryptjs';
import speakeasy from "speakeasy";
import { logger } from 'lib/logger';

/**
 * Verifies user credentials against stored values
 * @param username The provided username
 * @param password The provided password (plaintext)
 * @returns Promise resolving to true if credentials are valid, false otherwise
 */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const validUsername = process.env.ADMIN_USERNAME;
  let hashedPassword = process.env.ADMIN_PASSWORD_HASH;
  
  if (!validUsername || !hashedPassword) {
    logger.error('Environment variables not set correctly', { 
      usernameSet: !!validUsername,
      passwordHashSet: !!hashedPassword
    });
    return false;
  }

  hashedPassword = hashedPassword.replace(/\\(\$)/g, '$1');
  
  if (username !== validUsername) {
    logger.debug('Username mismatch', { 
      attempt: username.substring(0, 3) + '...'
    });
    return false;
  }
  
  try {
    logger.debug('Comparing password', {
      hashFormat: hashedPassword.substring(0, 7) + '...',
      hashLength: hashedPassword.length
    });
    
    const result = await bcrypt.compare(password, hashedPassword);
    logger.debug('Password comparison result', { result });
    
    return result;
  } catch (error) {
    logger.error('Error comparing password', { 
      error: error instanceof Error ? error.message : String(error)
    });
    return false;
  }
}

/**
 * Verifies a 2FA code
 */
export function verify2FACode(code: string): boolean {
  if (!code) return false;

  return speakeasy.totp.verify({
    secret: process.env.ADMIN_2FA_SECRET || "",
    encoding: "base32",
    token: code,
    window: 1,
  });
}

/**
 * Hashes a password using bcrypt
 * @param password The plaintext password
 * @returns Promise resolving to the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

/**
 * Generates a new 2FA secret
 */
export function generate2FASecret(): { secret: string; qrCode: string } {
  const secret = speakeasy.generateSecret({
    name: process.env.NEXTAUTH_URL || "Admin CMS",
  });

  return {
    secret: secret.base32,
    qrCode: secret.otpauth_url || "",
  };
}
