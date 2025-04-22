import { Octokit } from '@octokit/rest';

const GITHUB_OWNER = process.env.GITHUB_OWNER || '';
const GITHUB_REPO = process.env.GITHUB_REPO || '';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * Gets a file's content from GitHub
 */
export async function getFileContent(path: string): Promise<{content: string, sha: string} | null> {
  try {
    const response = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      ref: GITHUB_BRANCH,
    });
    
    if (Array.isArray(response.data)) {
      throw new Error('Expected file, but got directory');
    }
    
    if ('content' in response.data) {
      const content = Buffer.from(response.data.content, 'base64').toString('utf8');
      const sha = response.data.sha;
      
      return { content, sha };
    } else {
      throw new Error(`File at '${path}' doesn't contain content (might be a symlink)`);
    }
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    
    console.error('Error fetching file from GitHub:', error);
    throw error;
  }
}

/**
 * Creates or updates a file in GitHub
 */
export async function createOrUpdateFile(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<{ success: boolean, sha: string }> {
  try {
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    });
    
    return { 
      success: true, 
      sha: response.data.content?.sha ?? '' 
    };
  } catch (error) {
    console.error('Error creating/updating file in GitHub:', error);
    throw error;
  }
}

/**
 * Deletes a file from GitHub
 */
export async function deleteFile(path: string, message: string, sha: string): Promise<boolean> {
  try {
    await octokit.repos.deleteFile({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      message,
      sha,
      branch: GITHUB_BRANCH,
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting file from GitHub:', error);
    throw error;
  }
}