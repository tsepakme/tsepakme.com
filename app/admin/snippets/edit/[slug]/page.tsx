import { notFound } from 'next/navigation';
import { getSnippetBySlug } from 'app/snippets/lib/markdown';
import SnippetForm from 'app/admin/snippets/components/snippet-form';

interface EditSnippetPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: EditSnippetPageProps) {
  const snippet = await getSnippetBySlug(params.slug);
  
  if (!snippet) {
    return {
      title: 'Snippet Not Found'
    };
  }
  
  return {
    title: `Edit: ${snippet.meta.title} - Admin`
  };
}

export default async function EditSnippetPage({ params }: EditSnippetPageProps) {
  const snippet = await getSnippetBySlug(params.slug);
  
  if (!snippet) {
    notFound();
  }
  
  const initialData = {
    slug: snippet.slug,
    title: snippet.meta.title,
    description: snippet.meta.description,
    content: snippet.content,
    date: snippet.meta.date,
    category: snippet.meta.category,
    tags: snippet.meta.tags || [],
    difficulty: snippet.meta.difficulty || 'beginner',
    published: snippet.meta.published !== false
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit Snippet: {snippet.meta.title}</h1>
      <SnippetForm mode="edit" initialData={initialData} />
    </div>
  );
}