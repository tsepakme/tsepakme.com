/**
 * Class for rate limiting requests
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  
  /**
   * @param maxAttempts Maximum number of attempts allowed
   * @param windowMs Time window in milliseconds
   */
  constructor(maxAttempts: number, windowMs: number) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }
  
  /**
   * Checks if the request is rate limited
   */
  isRateLimited(key: string): boolean {
    this.cleanup();
    
    const now = Date.now();
    let attempts = this.attempts.get(key) || [];
    
    attempts = attempts.filter(timestamp => now - timestamp < this.windowMs);
    
    if (attempts.length >= this.maxAttempts) {
      return true;
    }
    
    attempts.push(now);
    this.attempts.set(key, attempts);
    
    return false;
  }
  
  /**
   * Cleans up old entries to save memory
   */
  private cleanup(): void {
    const now = Date.now();
    Array.from(this.attempts.keys()).forEach(key => {
      const timestamps = this.attempts.get(key)!;
      const validTimestamps = timestamps.filter(
        timestamp => now - timestamp < this.windowMs
      );
      
      if (validTimestamps.length === 0) {
        this.attempts.delete(key);
      } else {
        this.attempts.set(key, validTimestamps);
      }
    });
  }
}

export const loginLimiter = new RateLimiter(5, 15 * 60 * 1000);
export const apiLimiter = new RateLimiter(60, 60 * 1000);