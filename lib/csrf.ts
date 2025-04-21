import crypto from 'crypto';

// Token lifetime in seconds
const TOKEN_LIFETIME = 3600; // 1 hour

/**
 * Class for CSRF token management
 */
class CSRFTokenManager {
  // Map to store tokens and their creation timestamps
  private tokens: Map<string, number> = new Map();
  
  /**
   * Generates a new CSRF token
   */
  generate(): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.tokens.set(token, Date.now());
    this.cleanExpiredTokens();
    return token;
  }
  
  /**
   * Validates a CSRF token
   */
  async validate(token?: string | null): Promise<boolean> {
    if (!token) return false;
    
    const timestamp = this.tokens.get(token);
    if (!timestamp) return false;
    
    const isValid = Date.now() - timestamp < TOKEN_LIFETIME * 1000;
    
    if (!isValid) {
      this.tokens.delete(token);
      return false;
    }
    
    return true;
  }
  
  /**
   * Cleans expired tokens
   */
  private cleanExpiredTokens(): void {
    const now = Date.now();
    this.tokens.forEach((timestamp, token) => {
      if (now - timestamp > TOKEN_LIFETIME * 1000) {
        this.tokens.delete(token);
      }
    });
  }
}

// Export a singleton instance
export const csrf = new CSRFTokenManager();