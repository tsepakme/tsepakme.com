---
title: 'Critical Security Alert: React & Next.js Vulnerabilities (2025)'
description: 'A deep dive into the recent critical security vulnerabilities affecting React Server Components and Next.js, including CVE-2025-55182 (React2Shell).'
date: '2025-12-05'
tags: ['react', 'nextjs', 'security']
image: '/images/blog/security-leak.png'
---

## The "React2Shell" Vulnerability (CVE-2025-55182)

In late 2025, a critical vulnerability dubbed **React2Shell** was discovered in the React Server Components (RSC) "Flight" protocol. This vulnerability, tracked as **CVE-2025-55182**, is an unauthenticated Remote Code Execution (RCE) flaw with a maximum CVSS score of **10.0**.

### What Happened?
The vulnerability arises from insecure deserialization of malicious HTTP requests within the Flight protocol used by React Server Components. Attackers can craft specific payloads that, when processed by a vulnerable server, execute arbitrary code. This affects:

*   **React**: Versions 19.x prior to patch.
*   **Next.js**: Versions 15.x and 16.x (specifically those using the App Router).

Exploit attempts have been observed in the wild, making this an urgent patch priority.

## Related Denial-of-Service Vulnerabilities
Alongside the RCE flaw, two Denial-of-Service (DoS) vulnerabilities were identified:

1.  **CVE-2025-55184**: Allows an attacker to trigger an infinite loop via a crafted request, hanging the server process.
2.  **CVE-2025-67779**: The complete fix for the issue identified in 55184.

These flaws can easily take down a production application by consuming all available CPU resources.

## Source Code Exposure (CVE-2025-55183)
A medium-severity issue, **CVE-2025-55183**, was also disclosed. This vulnerability allows an attacker to retrieve the compiled source code of Server Functions. While less severe than RCE, it poses a significant risk if business logic or hardcoded secrets are exposed.

## Mitigation & Immediate Actions

If you are running a Next.js application (versions 15 or 16) or using React 19's Server Components, you must take action immediately:

1.  **Upgrade Immediately**: 
    *   Update `next` to the latest patched version (e.g., `15.x.latest` or `16.x.latest`).
    *   Update `react` and `react-dom` to the corresponding safe versions.
2.  **Rotate Secrets**: If your application was vulnerable and exposed to the internet prior to December 4, 2025, assume potential compromise. Rotate all environment variables, database credentials, and API keys.
3.  **Audit Logs**: Check server logs for suspicious activity or unusual request patterns that might indicate an attempted exploit.

## Best Practices Moving Forward

*   **Avoid Hardcoded Secrets**: Ensure no sensitive data is hardcoded in your source files, as vulnerabilities like CVE-2025-55183 can expose them.
*   **Input Validation**: Strict validation is your first line of defense.
*   **Dependency Management**: Use tools like `npm audit` or `pnpm audit` regularly and automate dependency updates where possible.

Stay safe and keep your packages updated!
