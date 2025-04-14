---
title: "JavaScript Memoization Techniques"
description: "Optimize function performance with memoization to avoid redundant calculations"
date: "2023-09-14"
category: "javascript"
tags: ["optimization", "performance", "caching", "algorithms"]
difficulty: "intermediate"
---

# JavaScript Memoization: Optimizing Function Performance

Memoization is a powerful optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again. This pattern significantly improves performance for computationally intensive functions, especially those with recursion or overlapping subproblems.

## Basic Memoization Implementation

Here's a simple yet effective memoization utility function:

```javascript
function memoize(fn) {
    const cache = {};
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache[key]) {
            console.log('Cache hit:', key);
            return cache[key];
        }
        console.log('Cache miss:', key);
        const result = fn(...args);
        cache[key] = result;
        return result;
    };
}

// Example: Memoizing a factorial function
const factorial = memoize(n => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
});

console.log(factorial(5)); // First calculation: 120
console.log(factorial(5)); // Returns from cache: 120
console.log(factorial(6)); // Partially from cache: 6 * factorial(5)
```

## Advanced Memoization Patterns

### Using WeakMap for Better Memory Management

```javascript
function memoizeWithWeakMap(fn) {
    const cache = new WeakMap();
    
    return function(obj) {
        if (!cache.has(obj)) {
            cache.set(obj, fn(obj));
        }
        return cache.get(obj);
    };
}

// Example with object references
const getObjectProperties = memoizeWithWeakMap(obj => {
    console.log('Computing properties...');
    return Object.keys(obj);
});

const user = { name: 'John', age: 30 };
console.log(getObjectProperties(user)); // Computed
console.log(getObjectProperties(user)); // From cache
```

### Memoization with Custom Key Generation

```javascript
function memoizeWithCustomKey(fn, keyFn) {
    const cache = {};
    
    return function(...args) {
        // Generate custom key based on arguments
        const key = keyFn ? keyFn(...args) : JSON.stringify(args);
        
        if (!(key in cache)) {
            cache[key] = fn.apply(this, args);
        }
        return cache[key];
    };
}

// Example: Memoizing API calls with custom key
const fetchUserData = memoizeWithCustomKey(
    async (userId, includeDetails) => {
        const response = await fetch(`/api/users/${userId}?details=${includeDetails}`);
        return response.json();
    },
    (userId, includeDetails) => `${userId}-${includeDetails}`
);
```

## Memoizing Recursive Functions

Recursive functions benefit greatly from memoization, especially when they compute the same values repeatedly. The classic example is the Fibonacci sequence:

```javascript
// Without memoization - exponential time complexity O(2^n)
function fibWithoutMemo(n) {
    if (n <= 1) return n;
    return fibWithoutMemo(n - 1) + fibWithoutMemo(n - 2);
}

// With memoization - linear time complexity O(n)
const fibWithMemo = memoize(n => {
    if (n <= 1) return n;
    return fibWithMemo(n - 1) + fibWithMemo(n - 2);
});

// Performance comparison
console.time('Without memoization');
fibWithoutMemo(30); // Very slow
console.timeEnd('Without memoization');

console.time('With memoization');
fibWithMemo(30);    // Much faster
console.timeEnd('With memoization');
```

## Practical Use Cases

### Dynamic Programming Problems

```javascript
// Memoized solution to the "Coin Change" problem
const minCoins = memoize((coins, amount) => {
    if (amount === 0) return 0;
    if (amount < 0) return Infinity;
    
    let min = Infinity;
    for (let coin of coins) {
        const result = 1 + minCoins(coins, amount - coin);
        min = Math.min(min, result);
    }
    return min;
});
```

### Expensive DOM Operations

```javascript
const calculateElementDimensions = memoize(element => {
    console.log('Computing dimensions...');
    const styles = window.getComputedStyle(element);
    // Expensive style calculations...
    return {
        width: parseInt(styles.width),
        height: parseInt(styles.height),
        padding: parseInt(styles.padding)
    };
});
```

## Best Practices and Limitations

1. **Monitor cache size**: For functions called with many different arguments, the cache can grow large. Consider implementing a cache eviction strategy:

```javascript
function memoizeWithLRU(fn, maxSize = 100) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            // Move this entry to the "most recently used" position
            const value = cache.get(key);
            cache.delete(key);
            cache.set(key, value);
            return value;
        }
        
        const result = fn.apply(this, args);
        
        // Evict least recently used item if we're at capacity
        if (cache.size >= maxSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        
        cache.set(key, result);
        return result;
    };
}
```

2. **Be cautious with impure functions**: Memoization assumes the function always returns the same output for the same input.

3. **Consider invalidation**: For some scenarios, you may need to clear the cache or implement time-based expiration.

Memoization is a powerful technique that showcases how a small amount of code can dramatically improve performance. By trading memory for speed, it's an excellent example of the space-time tradeoff in programming.