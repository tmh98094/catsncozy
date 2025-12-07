// GitHub Storage Utility
// This handles reading and writing data to your GitHub repository

interface GitHubConfig {
  owner: string;        // Your GitHub username
  repo: string;         // Your repository name
  token: string;        // Your GitHub Personal Access Token
  branch: string;       // Branch name (usually 'main')
}

interface GitHubFile {
  sha: string;
  content: string;
}

export class GitHubStorage {
  private config: GitHubConfig;
  private baseUrl: string;

  constructor(config: GitHubConfig) {
    this.config = config;
    this.baseUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents`;
  }

  /**
   * Read a JSON file from GitHub
   */
  async readJSON<T>(path: string): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${path}?ref=${this.config.branch}`, {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`File not found: ${path}`);
          return null;
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      const content = atob(data.content); // Decode base64
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error reading ${path}:`, error);
      return null;
    }
  }

  /**
   * Write a JSON file to GitHub
   */
  async writeJSON(path: string, data: any, message: string = 'Update data'): Promise<boolean> {
    try {
      // First, get the current file SHA (required for updates)
      const currentFile = await this.getFileSHA(path);
      
      const content = btoa(JSON.stringify(data, null, 2)); // Encode to base64

      const body: any = {
        message,
        content,
        branch: this.config.branch
      };

      // If file exists, include SHA for update
      if (currentFile) {
        body.sha = currentFile.sha;
      }

      const response = await fetch(`${this.baseUrl}/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `GitHub API error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error(`Error writing ${path}:`, error);
      throw error;
    }
  }

  /**
   * Get file SHA (required for updates)
   */
  private async getFileSHA(path: string): Promise<GitHubFile | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${path}?ref=${this.config.branch}`, {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.status === 404) {
        return null; // File doesn't exist yet
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      return { sha: data.sha, content: data.content };
    } catch (error) {
      console.error(`Error getting SHA for ${path}:`, error);
      return null;
    }
  }

  /**
   * Check if GitHub connection is working
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`https://api.github.com/repos/${this.config.owner}/${this.config.repo}`, {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('GitHub connection test failed:', error);
      return false;
    }
  }
}

// Singleton instance
let githubStorage: GitHubStorage | null = null;

export function initGitHubStorage(config: GitHubConfig): GitHubStorage {
  githubStorage = new GitHubStorage(config);
  return githubStorage;
}

export function getGitHubStorage(): GitHubStorage | null {
  return githubStorage;
}
