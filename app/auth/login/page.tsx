'use client';

import { useState, FormEvent, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      if (error === 'CredentialsSignin') {
        setError('Invalid username or password');
      } else {
        setError('An error occurred during sign in');
      }
    }
  }, [searchParams]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        setError(`Authentication error: ${result.error}`);
      } else if (result?.ok) {
        router.replace('/admin');
      }
    } catch (error) {
      setError(`Error during sign in: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Admin Login
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </>
  );
}