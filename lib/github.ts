import { Octokit } from '@octokit/rest';
import { logger } from 'lib/logger';

/**
 * Validate and get GitHub configuration
 */
function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO || "";
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !owner || !repo) {
    throw new Error('Required GitHub environment variables are not set');
  }

  if (!/^[a-zA-Z0-9-]+$/.test(owner)) {
    throw new Error(`Invalid owner format: ${owner}`);
  }
  if (!/^[a-zA-Z0-9_.-]+$/.test(repo)) {
    throw new Error(`Invalid repository format: ${repo}`);
  }

  return { token, owner, repo, branch };
}

function createOctokit() {
  const { token } = getGitHubConfig();
  
  return new Octokit({
    auth: token,
    userAgent: 'tsepakme-admin',
    timeZone: 'UTC',
    baseUrl: 'https://api.github.com',
    log: {
      debug: () => {},
      info: () => {},
      warn: message => logger.warn(message),
      error: message => logger.error(message)
    }
  });
}

const octokit = createOctokit();

/**
 * Gets a file's content from GitHub
 * @param path File path within the repository
 * @returns File content and SHA, or null if file doesn't exist
 */
export async function getFileContent(path: string): Promise<{content: string, sha: string} | null> {
  try {
    if (path.includes('../') || path.startsWith('/')) {
      throw new Error(`Invalid path format: ${path}`);
    }
    
    const { owner, repo, branch } = getGitHubConfig();
    
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    
    if (Array.isArray(response.data)) {
      throw new Error(`Expected file, but got directory: ${path}`);
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
    
    logger.error('Error fetching file from GitHub', { 
      path,
      error: error.message || 'Unknown error'
    });
    
    return null;
  }
}

/**
 * Creates or updates a file in GitHub
 * @param path File path within the repository
 * @param content File content
 * @param commitMessage Commit message
 * @returns Promise resolving when the operation completes
 */
export async function createOrUpdateFile(
  path: string,
  content: string,
  commitMessage: string
): Promise<void> {
  try {
    if (path.includes('../') || path.startsWith('/')) {
      throw new Error(`Invalid path format: ${path}`);
    }
    
    const config = getGitHubConfig();
    const { token, owner, repo, branch } = config;

    logger.info('Creating or updating file', { 
      path, 
      contentLength: content.length,
      repo: `${owner}/${repo}`
    });
    
    const contentBase64 = Buffer.from(content).toString('base64');
    
    let sha: string | undefined;
    try {
      const fileData = await getFileContent(path);
      if (fileData) {
        sha = fileData.sha;
      }
    } catch (error) {
      if (!(error instanceof Error && error.message.includes('404'))) {
        throw error;
      }
    }
    
    const requestData: any = {
      message: commitMessage,
      content: contentBase64,
      branch
    };
    
    if (sha) {
      requestData.sha = sha;
    }
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(requestData)
      }
    );
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to update file (${response.status}): ${errorData}`);
    }
    
    logger.info('File successfully updated', { path });
  } catch (error) {
    logger.error('Error updating file in GitHub', {
      path,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

/**
 * Deletes a file from GitHub
 * @param path File path to delete
 * @param message Commit message
 * @param sha SHA of the file to delete
 * @returns Promise resolving to true if successful
 */
export async function deleteFile(path: string, message: string, sha: string): Promise<boolean> {
  try {
    if (path.includes('../') || path.startsWith('/')) {
      throw new Error(`Invalid path format: ${path}`);
    }
    
    const { owner, repo, branch } = getGitHubConfig();
    
    logger.info('Deleting file from GitHub', { path });
    
    await octokit.repos.deleteFile({
      owner,
      repo,
      path,
      message,
      sha,
      branch,
    });
    
    logger.info('File successfully deleted', { path });
    return true;
  } catch (error) {
    logger.error('Error deleting file from GitHub', {
      path,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}