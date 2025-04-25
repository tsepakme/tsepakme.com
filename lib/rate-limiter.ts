/**
 * Rate limiter implementation to prevent brute force attacks
 * Uses in-memory LRU cache for tracking attempts
 */

import { LRUCache } from 'lru-cache';
import { logger } from './logger';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

interface RateLimitState {
  count: number;
  resetAt: number;
}

export class RateLimiter {
  private cache: LRUCache<string, RateLimitState>;

  constructor() {
    this.cache = new LRUCache<string, RateLimitState>({
      max: 500,
      ttl: WINDOW_MS
    });
  }

  /**
   * Check if a key (IP address) is rate limited
   * @param key Identifier (usually IP address)
   * @returns true if rate limited, false otherwise
   */
  public isRateLimited(key: string): boolean {
    const now = Date.now();
    const state = this.cache.get(key) || { count: 0, resetAt: now + WINDOW_MS };
    
    if (now > state.resetAt) {
      state.count = 0;
      state.resetAt = now + WINDOW_MS;
    }
    
    state.count += 1;
    
    this.cache.set(key, state);
    
    const isLimited = state.count > MAX_ATTEMPTS;
    
    if (isLimited) {
      logger.warn(`Rate limit exceeded for ${key.substring(0, 8)}...`, {
        attempts: state.count,
        resetAt: new Date(state.resetAt).toISOString()
      });
    }
    
    return isLimited;
  }

  /**
   * Get remaining login attempts for a key
   * @param key Identifier (usually IP address)
   * @returns Number of attempts remaining
   */
  public getRemainingAttempts(key: string): number {
    const state = this.cache.get(key);
    if (!state) return MAX_ATTEMPTS;
    
    return Math.max(0, MAX_ATTEMPTS - state.count);
  }
}

export const apiLimiter = new RateLimiter();