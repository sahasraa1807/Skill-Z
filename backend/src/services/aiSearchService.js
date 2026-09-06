const prisma = require('../config/prisma');
const { embedText, cosineSimilarity, getProjectText, getUserText } = require('./aiEmbeddingService');

/**
 * Semantic Project Search: Matches freeform natural language queries against project embeddings.
 */
async function searchProjectsSemantically(query, limit = 10) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return [];
  }

  const queryVector = embedText(query);
  const queryLower = query.toLowerCase();

  // Fetch active / recruiting projects
  const projects = await prisma.project.findMany({
    where: { status: 'RECRUITING' },
    include: {
      owner: {
        select: { id: true, name: true, username: true, avatarUrl: true }
      },
      roles: {
        include: {
          skills: { include: { skill: true } }
        }
      }
    }
  });

  const scored = projects.map(project => {
    const projectText = getProjectText(project);
    const projVector = embedText(projectText);
    let similarity = cosineSimilarity(queryVector, projVector);

    // Dynamic keyword boost if query terms appear directly in title, domain, or description
    const titleLower = project.title.toLowerCase();
    const descLower = project.description.toLowerCase();
    const domainLower = project.domain.toLowerCase();

    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
    let keywordHits = 0;
    queryWords.forEach(w => {
      if (titleLower.includes(w) || descLower.includes(w) || domainLower.includes(w)) {
        keywordHits++;
      }
    });

    if (queryWords.length > 0) {
      const keywordRatio = keywordHits / queryWords.length;
      similarity = Math.min(1.0, similarity * 0.7 + keywordRatio * 0.3);
    }

    const similarityPercent = Math.round(similarity * 100);

    // Generate AI match rationale
    const rationale = [];
    if (queryLower.includes('ai') || queryLower.includes('machine learning')) {
      if (titleLower.includes('ai') || descLower.includes('assistant') || descLower.includes('tutor') || descLower.includes('learning')) {
        rationale.push('Matches AI & Intelligent Systems focus');
      }
    }
    if (queryLower.includes('education') || queryLower.includes('learning') || queryLower.includes('study')) {
      if (domainLower.includes('edtech') || descLower.includes('learning') || descLower.includes('study') || titleLower.includes('tutor')) {
        rationale.push('Aligned with Education & EdTech domain');
      }
    }
    if (rationale.length === 0) {
      rationale.push(`Semantic concept relevance: ${similarityPercent}%`);
    }

    return {
      ...project,
      aiMatch: {
        similarityScore: similarityPercent,
        rationale: rationale.join(' • ')
      }
    };
  });

  // Filter out zero similarity and sort descending
  const filtered = scored.filter(p => p.aiMatch.similarityScore > 10);
  filtered.sort((a, b) => b.aiMatch.similarityScore - a.aiMatch.similarityScore);

  return filtered.slice(0, limit);
}

/**
 * Semantic Candidate Search: Matches natural language query against builder profiles.
 */
async function searchPeopleSemantically(query, limit = 10) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return [];
  }

  const queryVector = embedText(query);
  const candidates = await prisma.user.findMany({
    where: { onboardingCompleted: true },
    include: {
      skills: { include: { skill: true } },
      goals: true,
      preferences: true,
      projectProofs: true
    }
  });

  const scored = candidates.map(candidate => {
    const candidateText = getUserText(candidate);
    const candidateVector = embedText(candidateText);
    const similarity = cosineSimilarity(queryVector, candidateVector);
    const similarityPercent = Math.round(similarity * 100);

    return {
      id: candidate.id,
      name: candidate.name,
      username: candidate.username,
      bio: candidate.bio,
      location: candidate.location,
      avatarUrl: candidate.avatarUrl,
      skills: candidate.skills,
      preferences: candidate.preferences,
      projectProofs: candidate.projectProofs,
      aiMatch: {
        similarityScore: similarityPercent,
        rationale: `Semantic candidate fit: ${similarityPercent}%`
      }
    };
  });

  const filtered = scored.filter(c => c.aiMatch.similarityScore > 10);
  filtered.sort((a, b) => b.aiMatch.similarityScore - a.aiMatch.similarityScore);

  return filtered.slice(0, limit);
}

/**
 * AI Project Analysis: Evaluates project description to generate automated insights.
 */
async function analyzeProject(title, description, domain) {
  const fullText = `${title || ''} ${description || ''} ${domain || ''}`.toLowerCase();

  // Tech stack extraction
  const techKeywords = [
    'React', 'Next.js', 'Node.js', 'Python', 'PyTorch', 'TensorFlow', 'FastAPI',
    'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'TypeScript', 'Tailwind', 'Figma',
    'GraphQL', 'Go', 'Flutter', 'Prisma'
  ];
  const detectedStack = techKeywords.filter(tech => fullText.includes(tech.toLowerCase()));
  if (detectedStack.length === 0) {
    detectedStack.push('React', 'Node.js', 'PostgreSQL');
  }

  // Suggested team roles
  const suggestedRoles = [];
  if (fullText.includes('ai') || fullText.includes('ml') || fullText.includes('model') || fullText.includes('tutor') || fullText.includes('learning')) {
    suggestedRoles.push({ roleName: 'AI / ML Engineer', reason: 'To build and fine-tune intelligent models' });
  }
  if (fullText.includes('design') || fullText.includes('ui') || fullText.includes('ux') || fullText.includes('interface')) {
    suggestedRoles.push({ roleName: 'UI / UX Architect', reason: 'To design accessible and engaging interfaces' });
  }
  suggestedRoles.push({ roleName: 'Frontend Engineer', reason: 'To implement interactive user dashboards' });
  suggestedRoles.push({ roleName: 'Backend & API Developer', reason: 'To build scalable REST / Vector search endpoints' });

  // Complexity tier
  let complexityTier = 'MEDIUM';
  if (detectedStack.length >= 4 || fullText.includes('ai') || fullText.includes('blockchain') || fullText.includes('distributed')) {
    complexityTier = 'HIGH';
  } else if (description && description.length < 100) {
    complexityTier = 'LOW';
  }

  // Value proposition summary
  let valueProposition = `Builds a modern ${domain || 'software'} platform empowering users with scalable digital tools.`;
  if (fullText.includes('education') || fullText.includes('study') || fullText.includes('tutor')) {
    valueProposition = 'Empowers learners with personalized AI tutoring, automated study plans, and adaptive education workflows.';
  } else if (fullText.includes('collaboration') || fullText.includes('team')) {
    valueProposition = 'Streamlines real-time team collaboration, task tracking, and verified skill proof delivery.';
  }

  return {
    title,
    domain: domain || 'Software Development',
    complexityTier,
    techStackSummary: detectedStack,
    suggestedRoles: suggestedRoles.slice(0, 3),
    valueProposition
  };
}

module.exports = {
  searchProjectsSemantically,
  searchPeopleSemantically,
  analyzeProject
};
