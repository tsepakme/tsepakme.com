import SnippetForm from 'app/admin/snippets/components/snippet-form';

export const metadata = {
  title: 'Create New Snippet - Admin',
};

export default function CreateSnippetPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Create New Snippet</h1>
      <SnippetForm mode="create" />
    </div>
  );
}