/**
 * CSRF protection utility
 * Manages token generation and validation for CSRF protection
 */

import crypto from 'crypto';
import { logger } from './logger';

const TOKEN_LIFETIME = 3600;

class CSRFTokenManager {
  private tokens: Map<string, {timestamp: number, sessionId: string}> = new Map();
  
  /**
   * Generate a new CSRF token
   * @param sessionId Session identifier to associate with the token
   * @returns New CSRF token
   */
  generate(sessionId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.tokens.set(token, {
      timestamp: Date.now(),
      sessionId
    });
    this.cleanExpiredTokens();
    return token;
  }
  
  /**
   * Validate a CSRF token
   * @param token The token to validate
   * @param sessionId Session identifier to check against
   * @returns Whether the token is valid
   */
  async validate(token?: string | null, sessionId?: string): Promise<boolean> {
    if (!token) return false;
    
    const data = this.tokens.get(token);
    if (!data) return false;
    
    const isValid = Date.now() - data.timestamp < TOKEN_LIFETIME * 1000;
    
    if (!isValid) {
      this.tokens.delete(token);
      logger.warn('Invalid CSRF token detected', { token: token.substring(0, 6) + '...' });
      return false;
    }
    
    return true;
  }
  
  /**
   * Clean expired tokens from memory
   */
  private cleanExpiredTokens(): void {
    const now = Date.now();
    const expiredTokens: string[] = [];
    
    this.tokens.forEach((data, token) => {
      if (now - data.timestamp > TOKEN_LIFETIME * 1000) {
        expiredTokens.push(token);
      }
    });
    
    expiredTokens.forEach(token => {
      this.tokens.delete(token);
    });
  }
}

export const csrf = new CSRFTokenManager();