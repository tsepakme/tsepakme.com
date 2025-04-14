---
title: "Modern Async Fetch Patterns in JavaScript"
description: "Learn best practices for handling HTTP requests with the Fetch API and async/await"
date: "2023-12-05"
category: "javascript"
tags: ["fetch", "async", "error-handling", "http", "promises"]
difficulty: "beginner"
---

# Modern Async Fetch Patterns in JavaScript

The Fetch API provides a powerful and flexible way to make HTTP requests in JavaScript applications. Combined with async/await syntax, it offers a clean approach to handling asynchronous operations. This snippet explores best practices for implementing robust data fetching.

## Basic Fetch Pattern with Error Handling

A well-structured fetch function should include proper error handling, response validation, and a clean interface:

```javascript
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

// Usage
const users = await fetchData('https://api.example.com/users');
if (users) {
    // Process the data
    console.log(users);
} else {
    // Handle the error case
    showErrorMessage('Failed to load users');
}
```

## Extended Fetch Utility with Options

For real-world applications, you'll often need more control over request headers, methods, and body content:

```javascript
async function fetchWithOptions(url, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'same-origin' // or 'include' for cross-origin requests with cookies
    };
    
    const fetchOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, fetchOptions);
        
        // Handle different HTTP status codes
        if (response.status === 204) {
            return null; // No content
        }
        
        if (!response.ok) {
            // Try to parse error response if available
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            } catch (parseError) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        
        // Check content type to determine parsing method
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        
        if (contentType && contentType.includes('text/')) {
            return await response.text();
        }
        
        return await response.blob();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw to allow caller to handle
    }
}

// Usage examples
// GET request
const users = await fetchWithOptions('https://api.example.com/users')
    .catch(error => {
        console.log('Failed to fetch users:', error.message);
        return [];
    });

// POST request
const newUser = await fetchWithOptions('https://api.example.com/users', {
    method: 'POST',
    body: JSON.stringify({ name: 'John', email: 'john@example.com' })
}).catch(error => {
    console.log('Failed to create user:', error.message);
    return null;
});
```

## Implementing Timeout for Fetch Requests

The Fetch API doesn't natively support request timeouts, but you can implement them using `Promise.race()`:

```javascript
async function fetchWithTimeout(url, options = {}, timeout = 8000) {
    const controller = new AbortController();
    const { signal } = controller;
    
    // Create the timeout promise
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            controller.abort();
            reject(new Error(`Request timed out after ${timeout}ms`));
        }, timeout);
    });
    
    // Race between the fetch and the timeout
    try {
        const response = await Promise.race([
            fetch(url, { ...options, signal }),
            timeoutPromise
        ]);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Request was aborted due to timeout');
        } else {
            console.error('Fetch error:', error);
        }
        throw error;
    }
}

// Example usage with timeout
try {
    const data = await fetchWithTimeout('https://api.example.com/large-dataset', {}, 5000);
    console.log('Data received:', data);
} catch (error) {
    console.log('Request failed:', error.message);
    showFallbackUI();
}
```

## Retry Logic for Failed Requests

For handling unstable networks or temporary server issues, implementing a retry mechanism can improve reliability:

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3, delayMs = 1000) {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.warn(`Attempt ${attempt + 1} failed:`, error.message);
            lastError = error;
            
            // Don't wait after the last attempt
            if (attempt < maxRetries - 1) {
                // Exponential backoff: wait longer after each failure
                const delay = delayMs * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
}

// Usage
try {
    const data = await fetchWithRetry('https://api.example.com/unstable-endpoint');
    processData(data);
} catch (error) {
    handleFetchFailure(error);
}
```

## Caching Fetch Results

For performance optimization, you can cache responses to avoid redundant network requests:

```javascript
const responseCache = new Map();

async function fetchWithCache(url, options = {}, cacheTimeMs = 60000) {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    
    // Check if we have a valid cached response
    if (responseCache.has(cacheKey)) {
        const { data, timestamp } = responseCache.get(cacheKey);
        const isCacheValid = Date.now() - timestamp < cacheTimeMs;
        
        if (isCacheValid) {
            console.log('Using cached response for:', url);
            return data;
        } else {
            // Cache expired, remove it
            responseCache.delete(cacheKey);
        }
    }
    
    // If no valid cache, make the request
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store in cache
        responseCache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
        
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Clear old cache entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, { timestamp }] of responseCache.entries()) {
        if (now - timestamp > 300000) { // 5 minutes
            responseCache.delete(key);
        }
    }
}, 60000); // Check every minute
```

## Best Practices for API Data Fetching

1. **Centralize fetch logic** in service/API modules rather than scattering fetch calls throughout your application.
2. **Implement request cancellation** when components unmount to prevent state updates on unmounted components.
3. **Use meaningful status states** (loading, success, error) to handle UI feedback appropriately.
4. **Consider authentication handling** with interceptors to refresh tokens or redirect to login when needed.
5. **Implement request queuing** for dependent operations that must be processed sequentially.

By following these patterns, you can build resilient, maintainable data fetching logic in your JavaScript applications that gracefully handles network issues, timeouts, and other edge cases that commonly occur in web applications.