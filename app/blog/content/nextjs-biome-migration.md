---
title: "Next.js 15.5: Goodbye ESLint and Prettier, Hello Biome"
description: "Next.js 15.5 replaces ESLint and Prettier with Biome, a faster all-in-one tool for linting and formatting. Here’s what changed, why it matters, and how to migrate."
date: "2025-09-07"
tags: ["nextjs", "javascript", "biome", "linting", "prettier", "eslint", "web-development"]
published: true
---

The frontend ecosystem is changing fast, with new tools popping up that promise better speed, simplicity, and developer experience. One of the biggest shifts came from Next.js: starting with **version 15.5** (August 2025), the framework officially moved away from the **ESLint + Prettier** combo in favor of **Biome**.


## A Bit of Backstory  

The release of **ESLint v9** (April 2024) stirred up quite a bit of frustration in the community—many developers were forced to rewrite their configs due to breaking changes, and migration wasn’t exactly smooth. Around the same time, **Biome started gaining traction**—marketed as a fast, all-in-one alternative to both ESLint and Prettier.  

Since then, its popularity has only grown. Now, with **Next.js and Vercel backing Biome**, it looks more and more like this tool could become the new standard.

Of course, ESLint still has its strengths. Its ecosystem of plugins and fine-grained configuration is unmatched. But Biome’s **speed advantage** is undeniable—faster tooling directly translates into smoother developer experience and quicker CI/CD pipelines.


## What Changed in Next.js 15.5?  

The familiar `next lint` command — which previously ran ESLint (and relied on Prettier for formatting) — is now **deprecated**. Instead, developers must choose explicitly:

- **Biome** — a blazing-fast tool combining linting and formatting.  
- **ESLint** — still supported, but now requires explicit setup via `eslint.config.mjs`.

So `next lint` is no longer a black box. You pick your tool.


## What Does the New Setup Look Like?

### Biome
```json
{
  "scripts": {
    "lint": "biome check",
    "format": "biome format --write"
  }
}
```

### ESLint
```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

Next.js includes a codemod to help migrate configs and dependencies to either option—no manual work needed.

## Biome vs ESLint + Prettier: Benchmarked Comparison  

| Feature               | ESLint + Prettier                     | Biome (measured)                                |
|-----------------------|----------------------------------------|------------------------------------------------|
| **Formatting speed**  | Standard (JS-based, slower)            | Up to **25× faster** than Prettier ([OpenReplay](https://blog.openreplay.com/biome-toolchain-modern-frontend-projects/?utm_source=chatgpt.com), [AppSignal](https://blog.appsignal.com/2025/05/07/migrating-a-javascript-project-from-prettier-and-eslint-to-biomejs.html?utm_source=chatgpt.com)) |
| **Linting speed**     | Standard (JS-based, slower)            | Around **15× faster** than ESLint ([OpenReplay](https://blog.openreplay.com/biome-toolchain-modern-frontend-projects/?utm_source=chatgpt.com), [AppSignal](https://blog.appsignal.com/2025/05/07/migrating-a-javascript-project-from-prettier-and-eslint-to-biomejs.html?utm_source=chatgpt.com)) |
| **Developer feedback speeds** | N/A                            | ~ **15× faster linting** in benchmarks ([Reddit](https://www.reddit.com/r/nextjs/comments/1cnsvhf/whats_your_take_on_biome_have_you_replaced_eslint/?utm_source=chatgpt.com)) |
| **Setup complexity**  | Multiple tools & configs               | Single tool, unified config                     |
| **Customization**     | Very high (many plugins)               | Growing, but limited ecosystem                  |
| **CI/CD impact**      | Slower build times                     | Noticeably faster tooling                       |


## My Personal Take  

I migrated one of my pet projects to Biome, and the experience has been excellent. The configuration is simpler, one command handles both lint and format, and I can *feel* the speed—especially on CI/CD where saving seconds scales up. 


## Bottom Line  

The switch to Biome in Next.js 15.5 is more than just tooling—it signals a shift toward faster, leaner, and more unified development.  

If you maintain existing projects, a Biome trial might surprise you. For new projects—Biome feels like the future.