# Simplified Portfolio & Blog

A clean, performance-optimized portfolio site with integrated blog and code snippets collection. Built with Next.js, TypeScript, and Tailwind CSS.

**Simplified Architecture**: No admin panel, no authentication, no backend complexity - just pure content presentation.

## Features

### Content & Presentation
- **Pure Markdown support** for clean content authoring
- **TypeScript code snippets collection** with syntax highlighting
- **Dark/light mode** with system preference detection
- **Mobile-responsive design** with Tailwind CSS
- **Syntax highlighting** for code blocks
- **File-based content management** - no database needed

### Performance & SEO
- **Optimized for SEO** (sitemap, robots.txt, meta tags)
- **RSS Feed** for blog subscription
- **Dynamic OG images** for social media sharing
- **Vercel Analytics** integration
- **App Router** for better performance and routing
- **Static site generation** for blazing fast performance

### Technical Stack
- **Next.js 15** with App Router architecture
- **TypeScript** for type safety
- **Tailwind CSS v4** (alpha) for styling
- **Server Components** by default for optimal performance
- **Unified/Remark/Rehype** for Markdown processing

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

### Adding a Blog Post

Create a new `.md` file in `app/blog/content/` with frontmatter:

```markdown
---
title: "Your Post Title"
description: "Brief description of your post"
date: "YYYY-MM-DD"
tags: ["tag1", "tag2"]
published: true
---

Сontent goes here...
```

### Adding a Code Snippet

Create a new `.md` file in `app/snippets/content/` with frontmatter:

```markdown
---
title: "Utility Type Name"
description: "What this utility does"
date: "YYYY-MM-DD"
category: "typescript"
tags: ["utility-types", "generics"]
difficulty: "intermediate"
published: true
---

Your TypeScript snippet with explanations...
```

### File-based Content System

- **No database required** - all content stored as Markdown files
- **Git-based workflow** - version control your content
- **Simple deployment** - just push to repository
- **Automatic regeneration** - Next.js handles the rest

## Deployment

Optimized for deployment on Vercel with:

- Automatic preview deployments
- Edge function support
- Analytics integration

## License

MIT