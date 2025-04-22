'use client';

import { useEffect, useState } from 'react';

interface CSRFContextValue {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  fetchToken: () => Promise<string | null>;
}

async function fetchCSRFToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/csrf-token');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSRF token: ${response.status}`);
    }
    
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
}

/**
 * Hook for working with CSRF tokens
 */
export function useCSRF(): CSRFContextValue {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchToken = async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newToken = await fetchCSRFToken();
      if (!newToken) {
        throw new Error('Failed to fetch CSRF token');
      }
      
      setToken(newToken);
      return newToken;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchToken();
  }, []);
  
  return { token, isLoading, error, fetchToken };
}

/**
 * Component for adding CSRF token to forms
 */
export default function CSRFToken(): JSX.Element | null {
  const { token } = useCSRF();
  
  if (!token) return null;
  
  return <input type="hidden" name="csrfToken" value={token} />;
}

/**
 * Function for adding CSRF token to fetch requests
 */
export async function fetchWithCSRF(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  const csrfToken = await fetchCSRFToken();
  
  const headers = new Headers(options.headers || {});
  if (csrfToken) {
    headers.set('x-csrf-token', csrfToken);
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
}