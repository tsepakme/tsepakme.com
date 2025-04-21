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
    
    // Filter only attempts within the time window
    attempts = attempts.filter(timestamp => now - timestamp < this.windowMs);
    
    // If the number of attempts exceeds the limit, rate limit the request
    if (attempts.length >= this.maxAttempts) {
      return true;
    }
    
    // Add the new attempt
    attempts.push(now);
    this.attempts.set(key, attempts);
    
    return false;
  }
  
  /**
   * Cleans up old entries to save memory
   */
  private cleanup(): void {
    const now = Date.now();
    // Use Array.from to convert the entries to a regular array first
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

// Create instances for different request types
export const loginLimiter = new RateLimiter(5, 15 * 60 * 1000);  // 5 attempts per 15 minutes
export const apiLimiter = new RateLimiter(60, 60 * 1000);        // 60 requests per minute