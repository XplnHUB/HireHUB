import axios from 'axios';


const GITHUB_API_BASE = 'https://api.github.com';

export const getGitHubProfile = async (username) => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      }
    });
    return {
      username: response.data.login,
      name: response.data.name,
      avatarUrl: response.data.avatar_url,
      bio: response.data.bio,
      location: response.data.location,
      company: response.data.company,
      blog: response.data.blog,
      email: response.data.email,
      publicRepos: response.data.public_repos,
      publicGists: response.data.public_gists,
      followers: response.data.followers,
      following: response.data.following,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at,
      profileUrl: response.data.html_url
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('GitHub user not found');
    }
    throw new Error(`GitHub API error: ${error.message}`);
  }
};



export const getGitHubRepositories = async (username, limit = 10) => {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/users/${username}/repos`,
      {
        params: {
          sort: 'updated',
          per_page: limit,
          type: 'owner'
        },
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        }
      }
    );
    return response.data.map(repo => ({
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      openIssues: repo.open_issues_count,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      isPrivate: repo.private,
      topics: repo.topics || []
    }));
  } catch (error) {
    throw new Error(`Failed to fetch repositories: ${error.message}`);
  }
};



export const getGitHubContributions = async (username) => {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/users/${username}/events/public`,
      {
        params: { per_page: 100 },
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
          })
        }
      }
    );
    const events = response.data;
    const contributions = {
      totalEvents: events.length,
      commits: events.filter(e => e.type === 'PushEvent').length,
      pullRequests: events.filter(e => e.type === 'PullRequestEvent').length,
      issues: events.filter(e => e.type === 'IssuesEvent').length,
      reviews: events.filter(e => e.type === 'PullRequestReviewEvent').length,
      repositories: [...new Set(events.map(e => e.repo.name))].length
    };
    return contributions;
  } catch (error) {
    throw new Error(`Failed to fetch contributions: ${error.message}`);
  }
};



export const getGitHubStats = async (username) => {
  try {
    const [profile, repos, contributions] = await Promise.all([
      getGitHubProfile(username),
      getGitHubRepositories(username, 10),
      getGitHubContributions(username)
    ]);
    const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks, 0);
    const languages = repos
      .filter(repo => repo.language)
      .reduce((acc, repo) => {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
        return acc;
      }, {});
    return {
      profile,
      statistics: {
        totalStars,
        totalForks,
        totalRepos: profile.publicRepos,
        followers: profile.followers,
        following: profile.following,
        contributions
      },
      topRepositories: repos.slice(0, 5),
      languages: Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([lang, count]) => ({ language: lang, count }))
    };
  } catch (error) {
    throw new Error(`Failed to fetch GitHub stats: ${error.message}`);
  }
};



export const verifyGitHubUsername = async (username) => {
  try {
    await axios.get(`${GITHUB_API_BASE}/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      }
    });
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};