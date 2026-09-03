const prisma = require('../config/prisma');

/**
 * Calculates a dynamic 0-100% Profile Confidence Score for a user.
 * Evaluates across 4 quadrants:
 * 1. Self-Reported Baseline (25 pts)
 * 2. GitHub Connection & Activity (25 pts)
 * 3. Public Project Evidence (25 pts)
 * 4. Skill Verification & Evidence (25 pts)
 */
exports.calculateConfidence = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      skills: {
        include: { skill: true }
      },
      interests: true,
      goals: true,
      preferences: true,
      projectProofs: true
    }
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const prefs = user.preferences || {};
  const proofs = user.projectProofs || [];
  const skills = user.skills || [];
  const verifiedSkills = skills.filter(s => s.verified);

  let baselineScore = 0;
  let githubScore = 0;
  let projectProofScore = 0;
  let skillVerificationScore = 0;

  const nextActions = [];

  // ─────────────────────────────────────────────────────────────
  // 1. Self-Reported Profile Completeness (Max 25 pts)
  // ─────────────────────────────────────────────────────────────
  if (user.bio && user.bio.trim().length > 10) baselineScore += 5;
  else nextActions.push({ label: 'Add a descriptive bio', points: 5, action: 'EDIT_PROFILE' });

  if (user.location) baselineScore += 5;

  if (prefs.availabilityHours && prefs.availabilityHours > 0) baselineScore += 10;
  else nextActions.push({ label: 'Specify your weekly availability hours', points: 10, action: 'EDIT_PROFILE' });

  if (user.goals && user.goals.length > 0) baselineScore += 5;
  else nextActions.push({ label: 'Set your primary project goals', points: 5, action: 'EDIT_PROFILE' });

  // ─────────────────────────────────────────────────────────────
  // 2. GitHub Connected & Evidence (Max 25 pts)
  // ─────────────────────────────────────────────────────────────
  if (prefs.githubUrl && prefs.githubUrl.trim().length > 0) {
    githubScore += 15;
    // Check if portfolio or linkedin also provided as bonus
    if (prefs.portfolioUrl || prefs.linkedinUrl) {
      githubScore += 10;
    } else {
      githubScore += 5;
      nextActions.push({ label: 'Add portfolio or LinkedIn link', points: 5, action: 'EDIT_PROFILE' });
    }
  } else {
    nextActions.push({ label: 'Connect your GitHub profile', points: 20, action: 'CONNECT_GITHUB' });
  }

  // ─────────────────────────────────────────────────────────────
  // 3. Public Project Evidence (Max 25 pts)
  // ─────────────────────────────────────────────────────────────
  if (proofs.length >= 2) {
    projectProofScore = 25;
  } else if (proofs.length === 1) {
    projectProofScore = 15;
    nextActions.push({ label: 'Add a second project proof to reach max project credibility', points: 10, action: 'ADD_PROOF' });
  } else {
    nextActions.push({ label: 'Add a public project proof (repo or live demo link)', points: 15, action: 'ADD_PROOF' });
  }

  // ─────────────────────────────────────────────────────────────
  // 4. Skill Verification & Code Evidence (Max 25 pts)
  // ─────────────────────────────────────────────────────────────
  if (verifiedSkills.length >= 4) {
    skillVerificationScore = 25;
  } else if (verifiedSkills.length >= 2) {
    skillVerificationScore = 18;
    nextActions.push({ label: 'Verify more skills via GitHub repositories', points: 7, action: 'VERIFY_SKILLS' });
  } else if (verifiedSkills.length === 1) {
    skillVerificationScore = 10;
    nextActions.push({ label: 'Verify additional skills with code evidence', points: 15, action: 'VERIFY_SKILLS' });
  } else {
    if (prefs.githubUrl) {
      nextActions.push({ label: 'Sync & verify your skills against your GitHub repositories', points: 20, action: 'VERIFY_SKILLS' });
    } else {
      nextActions.push({ label: 'Verify your self-reported skills with repository proof', points: 25, action: 'VERIFY_SKILLS' });
    }
  }

  const totalScore = Math.min(100, baselineScore + githubScore + projectProofScore + skillVerificationScore);

  let tier = 'CALIBRATING';
  if (totalScore >= 70) {
    tier = 'VERIFIED';
  } else if (totalScore >= 40) {
    tier = 'ESTABLISHED';
  }

  return {
    score: totalScore,
    tier, // 'CALIBRATING' | 'ESTABLISHED' | 'VERIFIED'
    verifiedSkillsCount: verifiedSkills.length,
    totalSkillsCount: skills.length,
    proofsCount: proofs.length,
    breakdown: [
      { category: 'Profile Completeness', score: baselineScore, max: 25 },
      { category: 'GitHub & Social Footprint', score: githubScore, max: 25 },
      { category: 'Project Evidence', score: projectProofScore, max: 25 },
      { category: 'Verified Skill Proofs', score: skillVerificationScore, max: 25 }
    ],
    nextActions: nextActions.slice(0, 3)
  };
};
