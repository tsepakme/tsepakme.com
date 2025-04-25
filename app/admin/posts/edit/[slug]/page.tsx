import { notFound } from 'next/navigation';
import { getPostBySlug } from 'app/blog/lib/markdown';
import PostForm from 'app/admin/posts/components/post-form';

interface EditPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: EditPostPageProps) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }
  
  return {
    title: `Edit: ${post.meta.title} - Admin`
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  const initialData = {
    slug: post.slug,
    title: post.meta.title,
    description: post.meta.description,
    content: post.content,
    date: post.meta.date,
    tags: post.meta.tags || [],
    published: post.meta.published !== false
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit Post: {post.meta.title}</h1>
      <PostForm mode="edit" initialData={initialData} />
    </div>
  );
}