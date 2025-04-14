---
title: "Throttle Functions in JavaScript"
description: "Learn how to implement and use throttle patterns for limiting execution frequency"
date: "2024-01-25"
category: "javascript"
tags: ["performance", "events", "optimization", "functions"]
difficulty: "beginner"
---

# Throttle Functions in JavaScript

Throttling is a technique that limits how often a function can execute. Unlike [debouncing](/snippets/debounce) which waits for a quiet period, throttling ensures a function runs at a regular interval regardless of how many times it's called.

## Basic Throttle Implementation

Throttling guarantees that a function won't execute more than once in a specified time period. It's perfect for scenarios where you want regular updates during continuous events.

```javascript
function throttle(fn, limit) {
    let lastFunc, lastRan;
    return function(...args) {
        if (!lastRan) {
            fn.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= limit) {
                    fn.apply(this, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

const handleScroll = throttle(() => console.log('Scrolled!'), 1000);
window.addEventListener('scroll', handleScroll);
```

This implementation:

- Executes the function immediately on first call
- Sets a timestamp (`lastRan`)
- For subsequent calls within the limit period, schedules execution for when the period ends
- Ensures execution happens no more than once per specified time interval

## Simple Throttle Implementation

For cases when you need a simpler throttle that just enforces a maximum execution frequency:

```javascript
const simpleThrottle = (fn, limit) => {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// Usage example
const handleMouseMove = simpleThrottle((e) => {
  console.log(`Mouse position: ${e.clientX}, ${e.clientY}`);
  updateUI(e.clientX, e.clientY);
}, 100);

document.addEventListener('mousemove', handleMouseMove);
```

## Leading and Trailing Edge Control

This advanced implementation allows you to control whether the throttled function fires at the leading edge (start) and/or trailing edge (end) of the throttle period:

```javascript
function advancedThrottle(fn, limit, options = {}) {
  const { leading = true, trailing = true } = options;
  let lastFunc;
  let lastRan = 0;
  
  return function(...args) {
    const now = Date.now();
    const remaining = limit - (now - lastRan);
    
    // Execute immediately if leading edge is true and we haven't run yet
    if (leading && remaining > 0) {
      if (lastRan === 0) {
        lastRan = now;
        fn.apply(this, args);
      }
    } else if (leading && remaining <= 0) {
      lastRan = now;
      fn.apply(this, args);
    }
    
    // Schedule trailing edge execution
    if (trailing && remaining > 0) {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        lastRan = leading ? Date.now() : 0;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

// Execute only at the start of each throttle period
const leadingThrottle = advancedThrottle(updatePosition, 300, { trailing: false });

// Execute only at the end of each throttle period
const trailingThrottle = advancedThrottle(saveProgress, 1000, { leading: false });
```

## RequestAnimationFrame Throttle
For visual updates and animations, using `requestAnimationFrame` provides a more efficient throttling mechanism that aligns with the browser's rendering cycle:

```javascript
const rafThrottle = (fn) => {
  let ticking = false;
  
  return function(...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

// Perfect for scroll animations
const updateParallax = rafThrottle((scrollPos) => {
  document.querySelector('.background').style.transform = `translateY(${scrollPos * 0.5}px)`;
  document.querySelector('.foreground').style.transform = `translateY(${scrollPos * 0.2}px)`;
});

window.addEventListener('scroll', () => {
  updateParallax(window.scrollY);
});
```

## Common Use Cases for Throttling

1. Infinite Scroll

```javascript
let page = 1;
let loading = false;
let allContentLoaded = false;
const loadingIndicator = document.getElementById('loading');

const loadMoreContent = async () => {
  if (loading || allContentLoaded) return;
  
  // Check if we're near the bottom of the page
  const scrollPosition = window.innerHeight + window.pageYOffset;
  const pageHeight = document.documentElement.scrollHeight;
  
  if (pageHeight - scrollPosition > 300) return;
  
  loading = true;
  loadingIndicator.style.display = 'block';
  
  try {
    const response = await fetch(`/api/content?page=${page}`);
    const newItems = await response.json();
    
    if (newItems.length === 0) {
      allContentLoaded = true;
      loadingIndicator.style.display = 'none';
      return;
    }
    
    // Add content to page
    const contentContainer = document.getElementById('content');
    newItems.forEach(item => {
      const element = document.createElement('div');
      element.className = 'content-item';
      element.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      `;
      contentContainer.appendChild(element);
    });
    
    page++;
  } catch (error) {
    console.error('Failed to load content:', error);
  } finally {
    loading = false;
    loadingIndicator.style.display = 'none';
  }
};

// Throttle to prevent excessive calls during fast scrolling
const throttledLoadMore = throttle(loadMoreContent, 300);
window.addEventListener('scroll', throttledLoadMore);
```

2. Real-time Data Updates

```javascript
const stockPriceElement = document.getElementById('stock-price');
let previousPrice = null;

const updateStockPrice = (price) => {
  if (previousPrice !== null) {
    // Add visual indicator for price movement
    if (price > previousPrice) {
      stockPriceElement.classList.remove('price-down');
      stockPriceElement.classList.add('price-up');
    } else if (price < previousPrice) {
      stockPriceElement.classList.remove('price-up');
      stockPriceElement.classList.add('price-down');
    }
  }
  
  stockPriceElement.textContent = `$${price.toFixed(2)}`;
  previousPrice = price;
};

// Throttled update to avoid excessive DOM changes
const throttledUpdate = throttle(updateStockPrice, 500);

// Simulate frequent data updates from WebSocket
webSocket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  throttledUpdate(data.price);
};
```

3. Drag and Drop Operations

```javascript
let isDragging = false;
let dragElement = null;
let startX, startY, startLeft, startTop;

// Initialize drag functionality
const initDrag = (element) => {
  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragElement = element;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(getComputedStyle(element).left);
    startTop = parseInt(getComputedStyle(element).top);
  });
};

// Handle drag movements
const handleMouseMove = (e) => {
  if (!isDragging || !dragElement) return;
  
  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  
  dragElement.style.left = `${startLeft + deltaX}px`;
  dragElement.style.top = `${startTop + deltaY}px`;
  
  // Update associated elements or constraints
  updateRelatedElements(dragElement);
};

// Throttle the drag handler for better performance
const throttledMouseMove = throttle(handleMouseMove, 16); // ~60fps

document.addEventListener('mousemove', throttledMouseMove);
document.addEventListener('mouseup', () => {
  isDragging = false;
  dragElement = null;
});

// Initialize draggable elements
document.querySelectorAll('.draggable').forEach(initDrag);
```

## When to Use Throttle vs Debounce

For information on debouncing and when to use it instead of throttling, see the Debounce Functions in JavaScript snippet.


| Use Case | Preferred Technique | Why |
|-----------|-------------|----------|
| Scrolling events | Throttle | Regular updates during continuous scrolling |
| Mouse movement | Throttle | Consistent sampling of position |
| Data visualization | Throttle | Consistent sampling of position |
| Search input | Debounce | Wait for user to finish typing |
| Window resize | Debounce | Wait for resize to complete |

## Performance Best Practices

- **Choose the right interval**: Too short might not help performance, too long can make UI feel sluggish
- **Use passive event listeners** for scroll events: `addEventListener('scroll', handler, { passive: true })`
- **Consider using requestAnimationFrame** for visual updates rather than time-based throttling
- **Create throttle functions once** and reuse them, rather than creating new ones in render cycles
- **Clean up event listeners** when components unmount or are no longer needed

Throttling is an essential tool for performance optimization in JavaScript applications, especially when dealing with high-frequency events that could otherwise overwhelm the browser's rendering capabilities.