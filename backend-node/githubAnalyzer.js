require('dotenv').config();
const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MAX_REPOS_TO_INSPECT = 10;

// GitHub repo topics are lowercase-hyphenated (e.g. "nodejs", "aws"); resumes
// use human-readable names (e.g. "Node.js", "AWS") - normalize to bridge them.
const TOPIC_ACRONYMS = new Set(['aws', 'ci', 'cd', 'ui', 'ux', 'api', 'sql', 'gcp', 'http', 'css', 'html']);
const TOPIC_ALIASES = {
  nodejs: 'Node.js',
  reactjs: 'React',
  vuejs: 'Vue.js',
  nextjs: 'Next.js',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  mongodb: 'MongoDB',
  graphql: 'GraphQL',
  typescript: 'TypeScript',
  javascript: 'JavaScript'
};

function normalizeTopic(topic) {
  const lower = topic.toLowerCase();
  if (TOPIC_ALIASES[lower]) return TOPIC_ALIASES[lower];

  return topic
    .split(/[-_]/)
    .map(word => {
      const wordLower = word.toLowerCase();
      if (TOPIC_ACRONYMS.has(wordLower)) return wordLower.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function githubHeaders() {
  const headers = {
    'User-Agent': 'SkillBridge-GitHub-Analyzer',
    Accept: 'application/vnd.github+json'
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
}

function buildRateLimitError(error) {
  const status = error.response?.status;
  if (status !== 403 && status !== 429) return null;

  const remaining = error.response?.headers?.['x-ratelimit-remaining'];
  const resetHeader = error.response?.headers?.['x-ratelimit-reset'];
  const message = error.response?.data?.message || '';
  const isRateLimit = remaining === '0' || /rate limit/i.test(message);

  if (!isRateLimit) return null;

  const resetDate = resetHeader
    ? new Date(Number(resetHeader) * 1000).toISOString()
    : null;

  return {
    error: resetDate
      ? `GitHub API rate limit exceeded. Resets at ${resetDate}.`
      : 'GitHub API rate limit exceeded. Try again later.',
    status: 429
  };
}

async function fetchUserRepos(username) {
  const url = `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos`;
  const response = await axios.get(url, {
    headers: githubHeaders(),
    params: {
      per_page: 100,
      sort: 'pushed',
      type: 'owner'
    }
  });
  return response.data;
}

async function repoHasDockerfile(owner, repo) {
  try {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents`;
    const response = await axios.get(url, { headers: githubHeaders() });
    const entries = Array.isArray(response.data) ? response.data : [];
    return entries.some(entry => entry.name.toLowerCase() === 'dockerfile');
  } catch (error) {
    return false;
  }
}

async function repoHasCI(owner, repo) {
  try {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/.github/workflows`;
    const response = await axios.get(url, { headers: githubHeaders() });
    return Array.isArray(response.data) && response.data.length > 0;
  } catch (error) {
    return false;
  }
}

async function analyzeGithubProfile(username, resumeSkills = []) {
  if (!username || typeof username !== 'string' || !username.trim()) {
    return { error: 'GitHub username is required', status: 400 };
  }

  const cleanUsername = username.trim();
  let repos;

  try {
    repos = await fetchUserRepos(cleanUsername);
  } catch (error) {
    if (error.response?.status === 404) {
      return { error: `GitHub user "${cleanUsername}" not found`, status: 404 };
    }

    const rateLimitError = buildRateLimitError(error);
    if (rateLimitError) {
      return rateLimitError;
    }

    if (error.response) {
      return {
        error: `GitHub API error: ${error.response.status} ${error.response.statusText}`,
        status: error.response.status
      };
    }

    return { error: `Failed to reach GitHub API: ${error.message}`, status: 502 };
  }

  const allRepos = repos;


  const languages = [...new Set(
    allRepos
      .map(repo => repo.language)
      .filter(language => Boolean(language))
  )];

  const lastCommitDate = allRepos.reduce((latest, repo) => {
    if (!repo.pushed_at) return latest;
    if (!latest || new Date(repo.pushed_at) > new Date(latest)) {
      return repo.pushed_at;
    }
    return latest;
  }, null);

  const reposToInspect = allRepos.slice(0, MAX_REPOS_TO_INSPECT);

  let hasDocker = false;
  let hasCI = false;

  for (const repo of reposToInspect) {
    if (hasDocker && hasCI) break;

    const owner = repo.owner?.login || cleanUsername;

    const [dockerFound, ciFound] = await Promise.all([
      hasDocker ? Promise.resolve(true) : repoHasDockerfile(owner, repo.name),
      hasCI ? Promise.resolve(true) : repoHasCI(owner, repo.name)
    ]);

    if (dockerFound) hasDocker = true;
    if (ciFound) hasCI = true;
  }

  const topicSkills = allRepos.flatMap(repo =>
    Array.isArray(repo.topics) ? repo.topics.map(normalizeTopic) : []
  );

  const derivedSkills = new Set([...languages, ...topicSkills]);
  if (hasDocker) derivedSkills.add('Docker');
  if (hasCI) derivedSkills.add('CI/CD');

  const skills = [...derivedSkills];

  const evidenceMap = {};
  if (Array.isArray(resumeSkills) && resumeSkills.length > 0) {
    const skillsLower = skills.map(skill => skill.toLowerCase());
    resumeSkills.forEach(skill => {
      evidenceMap[skill] = skillsLower.includes(String(skill).toLowerCase());
    });
  }

  return {
    username: cleanUsername,
    languages,
    skills,
    repoCount: allRepos.length,
    hasDocker,
    hasCI,
    lastCommitDate: lastCommitDate || null,
    evidenceMap
  };
}

module.exports = {
  analyzeGithubProfile
};
