/**
 * Safe, non-blocking GitHub public profile metadata service with in-memory caching and strict 2s timeout.
 */

const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function getGitHubProfileStats(username) {
  if (!username || typeof username !== 'string') {
    return null;
  }

  const cleanUser = username.trim().replace(/^@/, '');
  const cached = cache.get(cleanUser);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const defaultStats = {
    username: cleanUser,
    publicRepos: 0,
    followers: 0,
    totalStars: 0,
    topLanguages: []
  };

  try {
    // 2-second strict abort signal
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}`, {
      headers: {
        'User-Agent': 'Skillz-Platform-Matcher',
        'Accept': 'application/vnd.github.v3+json'
      },
      signal: AbortSignal.timeout(2000)
    });

    if (!userRes.ok) {
      // Return safe fallback on 404 or rate-limiting
      return defaultStats;
    }

    const userData = await userRes.json();

    // Fetch public repos to aggregate stars and languages (quick top 10 repos)
    let totalStars = 0;
    const languagesMap = {};

    try {
      const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}/repos?per_page=10&sort=updated`, {
        headers: {
          'User-Agent': 'Skillz-Platform-Matcher',
          'Accept': 'application/vnd.github.v3+json'
        },
        signal: AbortSignal.timeout(2000)
      });

      if (reposRes.ok) {
        const reposData = await reposRes.json();
        if (Array.isArray(reposData)) {
          reposData.forEach(repo => {
            totalStars += repo.stargazers_count || 0;
            if (repo.language) {
              languagesMap[repo.language] = (languagesMap[repo.language] || 0) + 1;
            }
          });
        }
      }
    } catch {
      // If repos query times out, proceed with user data
    }

    const topLanguages = Object.entries(languagesMap)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang)
      .slice(0, 4);

    const stats = {
      username: cleanUser,
      publicRepos: userData.public_repos || 0,
      followers: userData.followers || 0,
      totalStars,
      topLanguages
    };

    cache.set(cleanUser, { timestamp: Date.now(), data: stats });
    return stats;
  } catch (err) {
    // Non-blocking fallback: never fail or hang
    return defaultStats;
  }
}

module.exports = {
  getGitHubProfileStats
};
