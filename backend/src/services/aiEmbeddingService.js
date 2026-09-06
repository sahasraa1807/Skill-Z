/**
 * High-performance, deterministic AI text embedding & vector similarity engine.
 * Computes dense vector representations and cosine similarity for semantic search.
 */

const VECTOR_DIM = 128;

// Common semantic domain dictionary for weighting intent
const DOMAIN_VOCAB = [
  'ai', 'artificial', 'intelligence', 'machine', 'learning', 'ml', 'nlp', 'vision',
  'education', 'edtech', 'tutor', 'study', 'learning', 'school', 'student', 'course',
  'web', 'frontend', 'backend', 'fullstack', 'react', 'node', 'python', 'typescript',
  'database', 'postgres', 'sql', 'mongo', 'cloud', 'devops', 'docker', 'aws',
  'mobile', 'ios', 'android', 'flutter', 'native', 'app',
  'design', 'figma', 'ui', 'ux', 'accessibility', 'user', 'interface',
  'crypto', 'blockchain', 'web3', 'decentralized', 'smart', 'contract',
  'health', 'healthtech', 'medical', 'fitness', 'patient', 'wellness',
  'fintech', 'finance', 'payment', 'banking', 'crypto', 'stock',
  'game', 'gamedev', 'unity', 'unreal', 'graphics', '3d',
  'open', 'source', 'startup', 'portfolio', 'hackathon', 'realtime', 'chat'
];

/**
 * Hash function for hashing tokens into vector dimensions
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Tokenize and normalize text into clean words
 */
function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

/**
 * Generate a normalized dense vector embedding (float array of length VECTOR_DIM)
 */
function embedText(text) {
  const tokens = tokenize(text);
  const vector = new Array(VECTOR_DIM).fill(0);

  if (tokens.length === 0) return vector;

  tokens.forEach((token, idx) => {
    // Check if token is in primary domain vocabulary for extra weight
    const isDomainTerm = DOMAIN_VOCAB.includes(token);
    const weight = isDomainTerm ? 2.5 : 1.0;

    const dim1 = hashString(token) % VECTOR_DIM;
    const dim2 = hashString(token + '_sub') % VECTOR_DIM;

    vector[dim1] += weight;
    vector[dim2] += weight * 0.5;

    // Positional decay weighting
    if (idx < 5) {
      vector[dim1] += 0.5;
    }
  });

  // L2 Vector Normalization (Unit length)
  let norm = 0;
  for (let i = 0; i < VECTOR_DIM; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);

  if (norm > 0) {
    for (let i = 0; i < VECTOR_DIM; i++) {
      vector[i] /= norm;
    }
  }

  return vector;
}

/**
 * Compute Cosine Similarity between two normalized vectors (0.0 to 1.0)
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  const sim = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.min(1.0, Math.max(0.0, sim));
}

/**
 * Generate document text representation for a project
 */
function getProjectText(project) {
  const roleSkills = (project.roles || [])
    .flatMap(r => (r.skills || []).map(s => s.skill?.name || s.name || ''))
    .filter(Boolean)
    .join(' ');

  return `Title: ${project.title}. Domain: ${project.domain}. Type: ${project.projectType}. Description: ${project.description}. Required Skills: ${roleSkills}`;
}

/**
 * Generate document text representation for a user profile
 */
function getUserText(user) {
  const skills = (user.skills || []).map(s => s.skill?.name || s.name || '').join(' ');
  const goals = (user.goals || []).map(g => g.goal || g).join(' ');
  const interests = (user.interests || []).map(i => i.interest?.name || i.name || i).join(' ');

  return `Name: ${user.name}. Username: ${user.username}. Bio: ${user.bio || ''}. Location: ${user.location || ''}. Skills: ${skills}. Goals: ${goals}. Interests: ${interests}`;
}

module.exports = {
  embedText,
  cosineSimilarity,
  getProjectText,
  getUserText
};
