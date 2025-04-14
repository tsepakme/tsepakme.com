# Portfolio & Blog with TypeScript Snippets

A modern, performance-optimized portfolio site with integrated blog and code snippets collection. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Content & Presentation
- **Pure Markdown support** for clean content authoring without client components
- **TypeScript code snippets collection** with syntax highlighting
- **Dark/light mode** with system preference detection
- **Mobile-responsive design** with Tailwind CSS
- **Syntax highlighting** for code blocks with copy functionality

### Performance & SEO
- **Optimized for SEO** (sitemap, robots.txt, JSON-LD schema)
- **RSS Feed** for blog subscription
- **Dynamic OG images** for social media sharing
- **Vercel Speed Insights / Web Analytics** integration
- **App Router** for better performance and routing

### Technical Stack
- **Next.js** with App Router architecture
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Static site generation** for blazing fast performance
- **Client/Server component separation** for optimal rendering

## Content Types

### Blog
Write and publish articles in Markdown format with:
- Frontmatter metadata for title, description, publish date
- Optional tags support
- Nested heading structure with proper semantics
- Code blocks with syntax highlighting

### Code Snippets
Share reusable TypeScript utility types and patterns:
- Categorized by difficulty and tags
- Syntax highlighting with rehype-highlight
- Copy-to-clipboard functionality
- Detailed explanations and usage examples

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Content Management

Adding a Blog Post

Create a new `.md` file in `content` with frontmatter:

```ts
---
title: "Your Post Title"
description: "Brief description of your post"
date: "YYYY-MM-DD"
tags: ["tag1", "tag2"]
---

Content goes here...
```

Adding a Code Snippet

Create a new `.md` file in `content` with frontmatter:

```ts
---
title: "JavaScript Utility Name"
description: "What this utility does"
date: "YYYY-MM-DD"
category: "javascript"
tags: ["performance", "other-tags"]
difficulty: "beginner|intermediate|advanced"
---

Content goes here...
```

## Deployment

Optimized for deployment on Vercel with:

- Automatic preview deployments
- Edge function support
- Analytics integration

## License

MIT