/**
 * Centralized configuration for the application
 * Gathers environment variables and provides defaults
 */

interface AppConfig {
  app: {
    name: string;
    baseUrl: string;
  };
  github: {
    token: string | undefined;
    owner: string | undefined;
    repo: string;
    branch: string;
  };
}

/**
 * Extract repository name from GitHub URL if needed
 */
function getRepoName(repoUrl: string = ''): string {
  if (repoUrl.includes('github.com/')) {
    return repoUrl.split('github.com/')[1].replace(/\.git$/, '');
  }
  return repoUrl;
}

export const config: AppConfig = {
  app: {
    name: 'tsepakme.com',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },
  github: {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER,
    repo: getRepoName(process.env.GITHUB_REPO || ''),
    branch: process.env.GITHUB_BRANCH || 'main',
  }
};