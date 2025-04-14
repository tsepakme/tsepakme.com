---
title: "Getting Started with Next.js"
description: "Learn the basics of Next.js and build your first application"
date: "2023-04-15"
tags: ["next.js", "react", "web-development"]
published: true
---

# Getting Started with Next.js

Next.js is a powerful React framework that enables features like server-side rendering, static site generation, and more without any configuration.

## Why Next.js?

Next.js provides a great developer experience with features like:

- **Server-Side Rendering (SSR)**: Pre-renders pages on the server for better performance and SEO
- **Static Site Generation (SSG)**: Generates HTML at build time for even faster page loads
- **File-System Based Routing**: Create pages by simply adding files to the `pages` directory
- **API Routes**: Build API endpoints easily within your Next.js application
- **Image Optimization**: Automatically optimize images for better performance
- **Zero Configuration**: Works out of the box with sensible defaults

## Setting Up Your First Next.js Project

Let's create a simple Next.js application:

```bash
npx create-next-app my-next-app
cd my-next-app
npm run dev
```

This will create a new Next.js project and start the development server at `http://localhost:3000`.

## Creating Pages

Next.js uses file-system based routing. To create a new page, simply add a file to the `pages` directory:

```ts
// pages/about.js
export default function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page of our website.</p>
    </div>
  );
}
```

Visit `http://localhost:3000/about` to see your new page.

## Data Fetching

Next.js provides several methods for data fetching:

getStaticProps (Static Site Generation)

```ts
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// This function runs at build time
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();

  return {
    props: {
      posts,
    },
  };
}
```

getServerSideProps (Server-Side Rendering)

```ts
export default function Dashboard({ data }) {
  return <div>{data.content}</div>;
}

// This function runs on every request
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/dashboard');
  const data = await res.json();

  return {
    props: { data },
  };
}
```

## Conclusion

Next.js provides a rich set of features that make it easier to build modern web applications. This post just scratches the surface of what's possible with Next.js. Check out the [official Next.js documentation](https://nextjs.org/docs) to learn more.
