'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  function getErrorMessage(errorCode: string | null): string {
    switch (errorCode) {
      case 'CredentialsSignin':
        return 'Invalid username or password';
      case 'AccessDenied':
        return 'You do not have permission to access this resource';
      case 'Too many login attempts. Please try again later.':
        return 'Too many login attempts. Please try again later.';
      default:
        return errorCode?.includes('Too many login attempts') 
          ? 'Too many login attempts. Please try again later.'
          : 'An error occurred during authentication';
    }
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Authentication Error
          </h1>
          <p className="text-neutral-700 dark:text-neutral-300">
            {getErrorMessage(error)}
          </p>
        </div>
        
        <div className="flex justify-center mt-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}