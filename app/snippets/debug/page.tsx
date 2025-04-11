import { getAllSnippetSlugs } from '../utils';

export default function DebugPage() {
  const slugs = getAllSnippetSlugs();
  
  return (
    <div>
      <h1>Available Snippets Slugs</h1>
      <ul>
        {slugs.map(slug => (
          <li key={slug}>
            <a href={`/snippets/${slug}`} className="text-blue-500 hover:underline">
              {slug}
            </a>
          </li>
        ))}
      </ul>
      
      <div className="mt-8">
        <h2>File Check</h2>
        <p>Current directory: {process.cwd()}</p>
        <p>App directory exists: {typeof process !== 'undefined' && require('fs').existsSync(`${process.cwd()}/app`) ? 'Yes' : 'No'}</p>
        <p>Content directory exists: {typeof process !== 'undefined' && require('fs').existsSync(`${process.cwd()}/app/snippets/content`) ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}