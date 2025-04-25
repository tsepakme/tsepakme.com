/**
 * Helper utilities for API routes
 * Includes common patterns for error handling and response formatting
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'app/api/auth/options';
import { logger } from './logger';

interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Creates a standardized error response
 */
export function errorResponse(error: ApiError | Error | string, status: number = 500) {
  const errorObj = typeof error === 'string' 
    ? { message: error } 
    : 'message' in error 
      ? error 
      : { message: String(error) };
      
  logger.error('API error', { 
    status, 
    error: errorObj.message,
    details: 'details' in errorObj ? errorObj.details : undefined
  });
      
  return NextResponse.json({ error: errorObj }, { status });
}

/**
 * Creates a standardized success response
 */
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Checks if user is authenticated as admin
 * Returns next handler result or 401 error
 */
export async function withAdminAuth(
  req: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }
    
    return await handler();
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error : String(error),
      500
    );
  }
}

/**
 * Safely parses JSON request body with error handling
 */
export async function parseJsonBody<T>(req: NextRequest): Promise<T | null> {
  try {
    return await req.json();
  } catch (error) {
    logger.error('Failed to parse request body', { 
      error: error instanceof Error ? error.message : String(error)
    });
    return null;
  }
}

/**
 * Validates that a path does not contain directory traversal attempts
 */
export function validatePath(path: string): boolean {
  return !path.includes('../') && !path.startsWith('/') && !path.includes('..\\');
}