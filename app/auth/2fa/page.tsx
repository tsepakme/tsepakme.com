'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function TwoFactorAuthPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!code) {
      setError('Please enter the verification code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.replace('/admin');
    } catch (error) {
      setError('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Two-Factor Authentication
      </h1>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Enter the verification code from your authenticator app.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Verification Code
          </label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            autoComplete="one-time-code"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-center text-xl letter-spacing-wide"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3 rounded text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </form>
    </>
  );
}