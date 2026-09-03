const prisma = require('../config/prisma');
const { getGitHubProfileStats } = require('./githubService');

// Skill to common GitHub languages/topics map for robust matching
const SKILL_SYNONYMS = {
  'React': ['react', 'javascript', 'typescript', 'jsx', 'tsx'],
  'Next.js': ['nextjs', 'next.js', 'react', 'typescript', 'javascript'],
  'Node.js': ['nodejs', 'node.js', 'javascript', 'typescript', 'express'],
  'Express': ['express', 'nodejs', 'javascript', 'typescript'],
  'Python': ['python', 'py', 'django', 'fastapi', 'flask'],
  'TypeScript': ['typescript', 'ts'],
  'JavaScript': ['javascript', 'js'],
  'HTML': ['html', 'html5'],
  'CSS': ['css', 'css3', 'tailwind', 'sass', 'scss'],
  'Tailwind CSS': ['tailwind', 'tailwindcss', 'css'],
  'Django': ['django', 'python'],
  'FastAPI': ['fastapi', 'python'],
  'PostgreSQL': ['postgresql', 'postgres', 'sql'],
  'MongoDB': ['mongodb', 'mongo', 'mongoose'],
  'Docker': ['docker', 'dockerfile'],
  'Vue': ['vue', 'vuejs', 'javascript', 'typescript'],
  'Angular': ['angular', 'typescript'],
  'Flutter': ['flutter', 'dart'],
  'Go': ['go', 'golang'],
  'PyTorch': ['pytorch', 'python', 'machine-learning'],
  'TensorFlow': ['tensorflow', 'python', 'machine-learning'],
  'Figma': ['figma', 'ui/ux', 'design']
};

/**
 * Scan GitHub repositories and project proofs to verify user's self-reported skills.
 */
async function verifySkillsFromGitHub(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      preferences: true,
      skills: { include: { skill: true } },
      projectProofs: true
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const githubUrl = user.preferences?.githubUrl;
  let username = '';
  if (githubUrl) {
    if (githubUrl.includes('github.com/')) {
      username = githubUrl.split('github.com/')[1]?.split('/')[0] || '';
    } else {
      username = githubUrl.replace(/^@/, '').trim();
    }
  }

  // Get detected languages from GitHub
  let githubLanguages = [];
  if (username) {
    const stats = await getGitHubProfileStats(username);
    githubLanguages = (stats?.topLanguages || []).map(l => l.toLowerCase());
  }

  // Also collect skills mentioned across user's Project Proofs
  const proofSkills = new Set();
  (user.projectProofs || []).forEach(proof => {
    (proof.skillsUsed || []).forEach(s => proofSkills.add(s.toLowerCase()));
  });

  const newlyVerified = [];

  for (const userSkill of user.skills) {
    const skillName = userSkill.skill.name;
    const skillLower = skillName.toLowerCase();
    const synonyms = (SKILL_SYNONYMS[skillName] || [skillLower]).map(s => s.toLowerCase());

    let isVerified = false;
    let source = '';
    let evidenceSummary = '';

    // Check GitHub languages
    const matchedLang = githubLanguages.find(lang => synonyms.includes(lang));
    if (matchedLang) {
      isVerified = true;
      source = 'GITHUB_ANALYSIS';
      evidenceSummary = `Demonstrated across public GitHub repositories (${matchedLang})`;
    }

    // Check Project Proofs
    if (!isVerified && (proofSkills.has(skillLower) || synonyms.some(s => proofSkills.has(s)))) {
      isVerified = true;
      source = 'PROJECT_PROOF';
      evidenceSummary = 'Demonstrated in documented project proof';
    }

    // If verified or already verified
    if (isVerified) {
      const updated = await prisma.userSkill.update({
        where: { id: userSkill.id },
        data: {
          verified: true,
          verificationSource: source,
          evidenceUrl: source === 'GITHUB_ANALYSIS' && username ? `https://github.com/${username}` : userSkill.evidenceUrl,
          evidenceSummary
        },
        include: { skill: true }
      });
      newlyVerified.push(updated);
    }
  }

  // Fetch updated skills
  const updatedSkills = await prisma.userSkill.findMany({
    where: { userId },
    include: { skill: true }
  });

  return {
    verifiedCount: updatedSkills.filter(s => s.verified).length,
    newlyVerifiedCount: newlyVerified.length,
    skills: updatedSkills
  };
}

module.exports = {
  verifySkillsFromGitHub
};
