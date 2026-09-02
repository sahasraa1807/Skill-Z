const prisma = require('../config/prisma');

/**
 * Calculates a multi-factor compatibility score (0-100%) between a User and a Project.
 * Non-blocking, pure synchronous calculation over pre-fetched entities.
 */
function calculateCompatibility(user, project) {
  if (!user || !project) {
    return {
      score: 50,
      breakdown: { skills: 20, goals: 15, schedule: 10, experience: 5 },
      reasons: ['Baseline compatibility']
    };
  }

  const reasons = [];

  // ─────────────────────────────────────────────────────────────
  // 1. Skill Synergy (Max 40 Points)
  // ─────────────────────────────────────────────────────────────
  let skillPoints = 0;
  const projectSkillMap = new Map();

  // Aggregate all skills required across project roles
  (project.roles || []).forEach(role => {
    (role.skills || []).forEach(rs => {
      const sId = rs.skillId || rs.skill?.id;
      const sName = rs.skill?.name || rs.name;
      if (sId) {
        projectSkillMap.set(sId, sName || 'Skill');
      }
    });
  });

  const totalRequiredSkills = projectSkillMap.size;
  const matchedSkillNames = [];

  if (totalRequiredSkills === 0) {
    // No specific required skills defined in project
    skillPoints = 25;
    reasons.push('Open skill requirements');
  } else {
    const userSkillMap = new Map();
    (user.skills || []).forEach(us => {
      const sId = us.skillId || us.skill?.id;
      if (sId) {
        userSkillMap.set(sId, us.proficiencyLevel || 'INTERMEDIATE');
      }
    });

    let earnedWeighted = 0;
    projectSkillMap.forEach((skillName, skillId) => {
      if (userSkillMap.has(skillId)) {
        matchedSkillNames.push(skillName);
        const level = userSkillMap.get(skillId);
        if (level === 'ADVANCED') earnedWeighted += 1.0;
        else if (level === 'INTERMEDIATE') earnedWeighted += 0.8;
        else earnedWeighted += 0.5; // BEGINNER
      }
    });

    const matchRatio = earnedWeighted / totalRequiredSkills;
    skillPoints = Math.round(matchRatio * 40);

    if (matchedSkillNames.length > 0) {
      reasons.push(`Skill match in ${matchedSkillNames.slice(0, 3).join(', ')}`);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2. Goal Alignment (Max 25 Points)
  // ─────────────────────────────────────────────────────────────
  let goalPoints = 10; // baseline
  const projectType = project.projectType;
  const userGoals = (user.goals || []).map(g => g.goal);

  if (userGoals.includes(projectType)) {
    goalPoints = 25;
    reasons.push(`Shared focus on ${projectType.toLowerCase().replace('_', ' ')} goals`);
  } else if (
    (projectType === 'PORTFOLIO' && userGoals.includes('LEARNING')) ||
    (projectType === 'LEARNING' && userGoals.includes('PORTFOLIO')) ||
    (projectType === 'STARTUP' && userGoals.includes('OPEN_SOURCE'))
  ) {
    goalPoints = 18;
    reasons.push('Complementary growth objectives');
  } else if (userGoals.length > 0) {
    goalPoints = 14;
  }

  // ─────────────────────────────────────────────────────────────
  // 3. Schedule & Time Commitment (Max 20 Points)
  // ─────────────────────────────────────────────────────────────
  let schedulePoints = 10; // baseline
  const userHours = user.preferences?.availabilityHours || 10;
  const projectHours = project.commitmentHours || 10;

  if (userHours >= projectHours) {
    schedulePoints = 15;
    reasons.push(`Available ${userHours}h/wk (needs ${projectHours}h/wk)`);
  } else if (userHours >= projectHours * 0.7) {
    schedulePoints = 11;
  } else {
    schedulePoints = 6;
  }

  // Preferred time overlap bonus (up to +5 pts)
  const prefs = user.preferences || {};
  if (prefs.preferWeekends || prefs.preferWeekdays || prefs.preferEvenings || prefs.preferMornings) {
    schedulePoints += 5;
  }

  // ─────────────────────────────────────────────────────────────
  // 4. Experience Tier Match (Max 15 Points)
  // ─────────────────────────────────────────────────────────────
  let experiencePoints = 10; // baseline
  const userExp = user.preferences?.experienceLevel || 'INTERMEDIATE';

  if (projectType === 'STARTUP') {
    if (userExp === 'EXPERIENCED') experiencePoints = 15;
    else if (userExp === 'INTERMEDIATE') experiencePoints = 12;
    else experiencePoints = 9;
  } else if (projectType === 'HACKATHON') {
    if (userExp === 'INTERMEDIATE' || userExp === 'EXPERIENCED') experiencePoints = 15;
    else experiencePoints = 11;
  } else {
    // PORTFOLIO / LEARNING / OPEN_SOURCE
    experiencePoints = 14;
  }

  // Total clamped 0-100
  const totalScore = Math.min(100, Math.max(10, skillPoints + goalPoints + schedulePoints + experiencePoints));

  return {
    score: totalScore,
    breakdown: {
      skills: skillPoints,
      goals: goalPoints,
      schedule: schedulePoints,
      experience: experiencePoints
    },
    reasons: reasons.length > 0 ? reasons : ['General profile synergy']
  };
}

/**
 * Get top recommended projects for a user.
 */
async function getRecommendedProjects(userId, limit = 4) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      skills: { include: { skill: true } },
      goals: true,
      preferences: true
    }
  });

  if (!user) return [];

  // Query recruiting projects where user is neither owner nor team member
  const projects = await prisma.project.findMany({
    where: {
      status: 'RECRUITING',
      ownerId: { not: userId },
      teamMembers: {
        none: { userId }
      }
    },
    include: {
      owner: {
        select: { id: true, name: true, username: true, avatarUrl: true }
      },
      roles: {
        include: {
          skills: { include: { skill: true } }
        }
      },
      teamMembers: true
    },
    take: 30
  });

  // Score each project
  const scored = projects.map(proj => {
    const comp = calculateCompatibility(user, proj);
    return {
      ...proj,
      compatibility: comp
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.compatibility.score - a.compatibility.score);

  return scored.slice(0, limit);
}

/**
 * Get top recommended candidates for a project owner's project.
 */
async function getRecommendedCandidates(projectId, limit = 4) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      roles: {
        include: {
          skills: { include: { skill: true } }
        }
      },
      teamMembers: true
    }
  });

  if (!project) return [];

  const excludedUserIds = [
    project.ownerId,
    ...(project.teamMembers || []).map(m => m.userId)
  ];

  const candidates = await prisma.user.findMany({
    where: {
      id: { notIn: excludedUserIds },
      onboardingCompleted: true
    },
    include: {
      skills: { include: { skill: true } },
      goals: true,
      preferences: true
    },
    take: 40
  });

  // Score each candidate
  const scored = candidates.map(candidate => {
    const comp = calculateCompatibility(candidate, project);
    return {
      id: candidate.id,
      name: candidate.name,
      username: candidate.username,
      bio: candidate.bio,
      location: candidate.location,
      avatarUrl: candidate.avatarUrl,
      skills: candidate.skills,
      preferences: candidate.preferences,
      compatibility: comp
    };
  });

  scored.sort((a, b) => b.compatibility.score - a.compatibility.score);

  return scored.slice(0, limit);
}

module.exports = {
  calculateCompatibility,
  getRecommendedProjects,
  getRecommendedCandidates
};
