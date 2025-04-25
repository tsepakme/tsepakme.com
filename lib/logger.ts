/**
 * Logger utility for consistent logging across the application
 * In production, this could be extended to send logs to a service
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  user?: string;
  path?: string;
  action?: string;
  [key: string]: any;
}

/**
 * Creates a log entry with consistent format
 */
function log(level: LogLevel, message: string, options?: LogOptions) {
  const timestamp = new Date().toISOString();
  const environment = process.env.NODE_ENV || 'development';
  
  const logEntry = {
    timestamp,
    level,
    message,
    environment,
    ...options
  };
  
  if (process.env.NODE_ENV === 'production') {
    console[level](JSON.stringify(logEntry));
  } else {
    console[level](message, options);
  }
}

/**
 * Logger interface with methods for different log levels
 */
export const logger = {
  debug: (message: string, options?: LogOptions) => {
    if (process.env.NODE_ENV !== 'production') {
      log('debug', message, options);
    }
  },
  
  info: (message: string, options?: LogOptions) => 
    log('info', message, options),
  
  warn: (message: string, options?: LogOptions) => 
    log('warn', message, options),
  
  error: (message: string, options?: LogOptions) => 
    log('error', message, options),
};