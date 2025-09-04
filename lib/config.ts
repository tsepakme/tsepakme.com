/**
 * Centralized configuration for the application
 * Gathers environment variables and provides defaults
 */

interface AppConfig {
  app: {
    name: string;
    baseUrl: string;
  };
  auth: {
    tokenLifetime: number;
    adminUsername: string | undefined;
    adminPasswordHash: string | undefined;
  };
  github: {
    token: string | undefined;
    owner: string | undefined;
    repo: string;
    branch: string;
  };
  security: {
    rateLimit: {
      window: number;
      maxAttempts: number;
    };
    csrfTokenLifetime: number;
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

/**
 * Fix hash escaping issues for bcrypt hashes
 */
function normalizeHash(hash: string = ''): string {
  return hash.replace(/\\(\$)/g, '$1');
}

export const config: AppConfig = {
  app: {
    name: 'tsepakme.com',
    baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  auth: {
    tokenLifetime: 60 * 60,
    adminUsername: process.env.ADMIN_USERNAME,
    adminPasswordHash: normalizeHash(process.env.ADMIN_PASSWORD_HASH || ''),
  },
  github: {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER,
    repo: getRepoName(process.env.GITHUB_REPO || ''),
    branch: process.env.GITHUB_BRANCH || 'main',
  },
  security: {
    rateLimit: {
      window: 15 * 60 * 1000,
      maxAttempts: 5,
    },
    csrfTokenLifetime: 60 * 60,
  }
};