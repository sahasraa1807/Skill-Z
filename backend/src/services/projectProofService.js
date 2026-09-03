const prisma = require('../config/prisma');

/**
 * Add a new project proof for a user.
 */
async function addProjectProof(userId, data) {
  const { title, description, repoUrl, liveUrl, skillsUsed = [] } = data;

  if (!title || title.trim().length === 0) {
    const err = new Error('Project title is required');
    err.statusCode = 400;
    throw err;
  }

  // Auto-scan repo if GitHub URL
  let metrics = null;
  let verified = false;

  if (repoUrl && repoUrl.includes('github.com/')) {
    try {
      const parts = repoUrl.split('github.com/')[1]?.split('/');
      const owner = parts[0];
      const repo = parts[1]?.replace(/\.git$/, '');

      if (owner && repo) {
        // Safe 2s timeout
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            'User-Agent': 'Skillz-Platform',
            'Accept': 'application/vnd.github.v3+json'
          },
          signal: AbortSignal.timeout(2000)
        });

        if (res.ok) {
          const repoData = await res.json();
          metrics = {
            stars: repoData.stargazers_count || 0,
            forks: repoData.forks_count || 0,
            language: repoData.language || null
          };
          verified = true;
        }
      }
    } catch {
      // Non-blocking fallback
    }
  }

  const proof = await prisma.projectProof.create({
    data: {
      userId,
      title: title.trim(),
      description: description ? description.trim() : null,
      repoUrl: repoUrl ? repoUrl.trim() : null,
      liveUrl: liveUrl ? liveUrl.trim() : null,
      skillsUsed: Array.isArray(skillsUsed) ? skillsUsed : [],
      verified,
      metrics
    }
  });

  return proof;
}

/**
 * Get project proofs for a user by username or userId.
 */
async function getUserProofs(identifier) {
  let userId = identifier;
  // If identifier is a username, look up userId
  if (!identifier.includes('-')) {
    const user = await prisma.user.findUnique({
      where: { username: identifier },
      select: { id: true }
    });
    if (user) userId = user.id;
  }

  return prisma.projectProof.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Delete a project proof.
 */
async function deleteProjectProof(userId, proofId) {
  const proof = await prisma.projectProof.findUnique({
    where: { id: proofId }
  });

  if (!proof) {
    const err = new Error('Project proof not found');
    err.statusCode = 404;
    throw err;
  }

  if (proof.userId !== userId) {
    const err = new Error('Unauthorized to delete this proof');
    err.statusCode = 403;
    throw err;
  }

  return prisma.projectProof.delete({
    where: { id: proofId }
  });
}

module.exports = {
  addProjectProof,
  getUserProofs,
  deleteProjectProof
};
