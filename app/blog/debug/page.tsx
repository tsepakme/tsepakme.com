import fs from 'fs';
import path from 'path';

export default function DebugPage() {
  const postsDirectory = path.join(process.cwd(), 'app', 'blog', 'posts');
  const fileExists = fs.existsSync(postsDirectory);
  
  let files: string[] = [];
  if (fileExists) {
    files = fs.readdirSync(postsDirectory);
  }
  
  return (
    <div>
      <h1>Blog Debug Info</h1>
      <p>Current working directory: {process.cwd()}</p>
      <p>Posts directory: {postsDirectory}</p>
      <p>Directory exists: {fileExists ? 'Yes' : 'No'}</p>
      
      <h2>Files in directory:</h2>
      {files.length === 0 ? (
        <p>No files found</p>
      ) : (
        <ul>
          {files.map(file => (
            <li key={file}>
              {file} - Is MDX: {file.endsWith('.mdx') ? 'Yes' : 'No'}
            </li>
          ))}
        </ul>
      )}
      
      <h2>Full directory structure:</h2>
      <pre>{JSON.stringify(listDirectoryStructure(path.join(process.cwd(), 'app')), null, 2)}</pre>
    </div>
  );
}

function listDirectoryStructure(dir, depth = 0) {
  if (depth > 3) return null;
  
  try {
    const items = fs.readdirSync(dir);
    const result = {};
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const isDirectory = fs.statSync(itemPath).isDirectory();
      
      if (isDirectory) {
        result[item] = listDirectoryStructure(itemPath, depth + 1);
      } else {
        result[item] = null;
      }
    }
    
    return result;
  } catch (error) {
    console.error(`Error listing directory ${dir}:`, error);
    return null;
  }
}