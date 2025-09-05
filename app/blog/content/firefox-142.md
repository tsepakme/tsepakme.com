---
title: "Firefox 142: New APIs for Smarter Web Apps"
description: "Discover what’s new for developers in Firefox 142: URLPattern API, Prioritized Task Scheduling, Shadow DOM selections, improved animations, directory uploads, and more."
date: "2025-09-05"
tags: ["firefox", "javascript", "web-development", "api"]
published: true
---

Since I’ve been using Firefox a lot at work lately, I thought I’d share with you some of the things I’ve noticed in the latest update that I found particularly interesting. In this article, I’ll walk you through exactly what caught my attention in Firefox 142 and how it can make web development a bit smoother.

## 1. Smarter Routing with URLPattern API

The **URLPattern API** provides a native way to match and parse URLs, making client-side routing and URL handling more declarative.
```js
const pattern = new URLPattern({ pathname: "/products/:id" });
const match = pattern.exec("https://example.com/products/42");
console.log(match.pathname.groups.id); // "42"
```

Perfect for SPAs, deep linking, or any app that needs structured URL handling without relying on heavy third-party routers.

---

## 2. Prioritized Task Scheduling

With the **Prioritized Task Scheduling API**, you can give different weights to tasks, ensuring UI updates and critical actions stay responsive while background work runs smoothly.

This helps avoid dropped frames and unresponsive moments when apps juggle multiple async operations.

---

## 3. Shadow DOM Text Selections

The new `Selection.getComposedRanges()` method makes it possible to capture selections that span across **Shadow DOM** boundaries.  

```js
const ranges = getSelection().getComposedRanges();
```

Great for editors, design tools, or any web component that needs precise control over user text selections inside shadow roots.

---

## 4. Animation Upgrades

Two key improvements landed for the **Web Animations API**:

- `animation.overallProgress`: exposes normalized progress (0 → 1) across the entire animation lifecycle.  
- `animation.commitStyles()`: can now apply the final computed styles even without a `fill` value.

These upgrades simplify syncing animations with UI state and persisting styles after playback.

---

## 5. Directory Uploads

Firefox 142 extends support for **directory selection** with `<input type="file" webkitdirectory>`, including `File.webkitRelativePath` on Android.  

This enables apps to let users upload entire folders—handy for photo galleries, document managers, or dev tools.

---

## 6. AI-Powered Extensions with wllama API

A new `wllama` API allows Firefox extensions to integrate **local LLMs** (large language models).  
Extension developers can now build smart assistants, text analyzers, or offline AI tools directly inside the browser.

---

## 7. DevTools Enhancements

- **Configurable Debugger Overlay**: control whether the dimmed overlay appears when scripts are paused.  
- **Improved Netmonitor**: view headers, cookies, and params even while a request is still in progress.

These tweaks make debugging smoother and faster, especially when working with complex client-server flows.

---

## Browser Support & Caveats

As with any new web platform features, adoption across browsers varies:

- **URLPattern API** → Supported in Chromium and now Firefox 142, but not yet in Safari.  
  👉 Use it for progressive enhancement or fall back to libraries like [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp).

- **Prioritized Task Scheduling** → Experimental; supported in Chromium and Firefox, but not standardized everywhere.  
  👉 Keep a graceful fallback with regular `setTimeout` or `requestIdleCallback`.

- **Selection.getComposedRanges()** → Currently Firefox-only.  
  👉 For cross-browser apps, stick to standard `getRangeAt()` until wider support arrives.

- **Animation.overallProgress & commitStyles()** → Supported in Firefox 142+ and Chromium, but Safari still lags.  
  👉 Consider feature-detection (\`if ("overallProgress" in Animation.prototype)\`) before relying on it.

- **Directory Uploads** (\`webkitdirectory\`) → Works in Chromium and Firefox 142 (including Android). Safari support is partial.  
  👉 Always provide single-file fallback for mobile and older browsers.

- **wllama API** → Firefox-only, extension context only. Not available in Chromium or Safari.  
  👉 Use it for Firefox-targeted extensions or provide cloud-based alternatives elsewhere.

- **Debugger Overlay & Netmonitor improvements** → Firefox DevTools only, no cross-browser parity expected.  

⚠️ **Takeaway**: Many of these APIs are cutting-edge. Use feature detection and polyfills where possible, and treat them as progressive enhancements rather than core requirements.

---

## Bottom Line

Firefox 142 equips developers with modern APIs that tackle real-world challenges:

- Declarative URL routing  
- Fine-grained task scheduling  
- Better Shadow DOM handling  
- Cleaner animation state management  
- Directory-level file access  
- On-device AI extensions  
- Smarter debugging tools  

If you’re building modern, high-performance web apps, this Firefox release is worth exploring.
