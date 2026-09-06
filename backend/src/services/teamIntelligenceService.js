const prisma = require('../config/prisma');
const { getRecommendedCandidates } = require('./matchingService');
const { calculateConfidence } = require('./profileConfidenceService');

/**
 * Phase 7: Team Intelligence Service
 * Analyzes team composition, detects missing skills/roles, computes Team Health Score (0-100%),
 * and recommends candidate pools for team backfills.
 */
async function analyzeTeam(projectId) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: {
        include: {
          skills: { include: { skill: true } },
          preferences: true
        }
      },
      teamMembers: {
        include: {
          user: {
            include: {
              skills: { include: { skill: true } },
              preferences: true,
              goals: true
            }
          }
        }
      },
      roles: {
        include: {
          skills: { include: { skill: true } }
        }
      }
    }
  });

  if (!project) {
    throw new Error('Project not found');
  }

  // 1. Existing Team & Skill Coverage
  const members = project.teamMembers.map(tm => tm.user).filter(Boolean);
  if (!members.some(m => m.id === project.owner.id)) {
    members.push(project.owner);
  }

  const teamSkillMap = new Map(); // skillId -> { name, category, verified }
  members.forEach(member => {
    (member.skills || []).forEach(us => {
      const sId = us.skillId || us.skill?.id;
      const sName = us.skill?.name || us.name;
      const sCategory = us.skill?.category || 'General';
      if (sId) {
        teamSkillMap.set(sId, {
          id: sId,
          name: sName,
          category: sCategory,
          verified: us.verified || false
        });
      }
    });
  });

  // 2. Project Role & Required Skill Coverage Analysis
  const roleCoverage = [];
  const missingSkills = [];
  const openRoles = [];

  (project.roles || []).forEach(role => {
    const requiredRoleSkills = (role.skills || []).map(rs => rs.skill?.name || rs.name);
    const isFilled = role.openings <= 0;

    // Check how many skills of this role are covered by existing team
    let coveredCount = 0;
    requiredRoleSkills.forEach(skillName => {
      const isCovered = Array.from(teamSkillMap.values()).some(
        s => s.name.toLowerCase() === skillName.toLowerCase()
      );
      if (isCovered) {
        coveredCount++;
      } else {
        missingSkills.push({ skillName, roleName: role.roleName });
      }
    });

    const isCoveredFully = requiredRoleSkills.length > 0 ? (coveredCount / requiredRoleSkills.length >= 0.5) : isFilled;

    roleCoverage.push({
      roleId: role.id,
      roleName: role.roleName,
      openings: role.openings,
      requiredSkills: requiredRoleSkills,
      isCovered: isCoveredFully,
      status: isFilled ? 'FILLED' : isCoveredFully ? 'PARTIAL' : 'VACANT'
    });

    if (role.openings > 0) {
      openRoles.push(role);
    }
  });

  // 3. Domain Coverage Matrix (Frontend, Backend, AI/ML, DevOps, Design, Database)
  const domains = ['Frontend', 'Backend', 'AI/ML', 'Database', 'DevOps', 'Design'];
  const domainMatrix = domains.map(domain => {
    const isCovered = Array.from(teamSkillMap.values()).some(s => 
      s.category.toLowerCase().includes(domain.toLowerCase()) || 
      s.name.toLowerCase().includes(domain.toLowerCase())
    );
    return {
      domain,
      isCovered,
      statusSymbol: isCovered ? '✓' : '✗'
    };
  });

  // 4. Calculate Team Health Score (0 - 100 Points)
  // A. Role Fill Ratio (Max 40 Pts)
  const totalRoles = project.roles.length || 1;
  const coveredRoleCount = roleCoverage.filter(r => r.isCovered).length;
  const roleScore = Math.round((coveredRoleCount / totalRoles) * 40);

  // B. Skill Domain Balance (Max 30 Pts)
  const coveredDomainCount = domainMatrix.filter(d => d.isCovered).length;
  const domainScore = Math.round((coveredDomainCount / domainMatrix.length) * 30);

  // C. Team Trust & Verification Level (Max 30 Pts)
  let trustSum = 0;
  for (const member of members) {
    try {
      const conf = await calculateConfidence(member.id);
      trustSum += conf.score;
    } catch {
      trustSum += 40;
    }
  }
  const avgTrustScore = members.length > 0 ? Math.round(trustSum / members.length) : 40;
  const trustPoints = Math.round((avgTrustScore / 100) * 30);

  const teamHealthScore = Math.min(100, Math.max(15, roleScore + domainScore + trustPoints));

  let healthTier = 'BALANCED';
  let healthLabel = 'Balanced Team';
  let healthBadge = 'bg-blue-50 text-blue-700 border-blue-200';
  if (teamHealthScore >= 80) {
    healthTier = 'OPTIMAL';
    healthLabel = 'Optimal Team Coverage';
    healthBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (teamHealthScore < 50) {
    healthTier = 'NEEDS BACKFILL';
    healthLabel = 'Critical Role Voids';
    healthBadge = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  // 5. Candidate Recommendations for Missing Role Slots
  const roleRecommendations = [];
  for (const openRole of openRoles) {
    let candidatePool = [];
    try {
      candidatePool = await getRecommendedCandidates(project.id, 5);
    } catch (e) {
      console.error('Failed to load candidates for open role:', e);
    }

    roleRecommendations.push({
      roleId: openRole.id,
      roleName: openRole.roleName,
      requiredSkills: (openRole.skills || []).map(s => s.skill?.name || s.name),
      candidates: candidatePool.map(c => ({
        id: c.id,
        name: c.name,
        username: c.username,
        avatarUrl: c.avatarUrl,
        compatibilityScore: c.compatibility.score,
        confidenceTier: c.compatibility.confidenceTier,
        topSkills: (c.skills || []).slice(0, 3).map(s => s.skill?.name || s.name),
        reasons: c.compatibility.reasons
      }))
    });
  }

  // 6. Actionable Team Suggestions
  const recommendations = [];
  if (openRoles.length > 0) {
    recommendations.push(`Add a ${openRoles[0].roleName} to complete core requirements.`);
  }
  const missingDomains = domainMatrix.filter(d => !d.isCovered).map(d => d.domain);
  if (missingDomains.length > 0) {
    recommendations.push(`Skill void detected in ${missingDomains.join(', ')}.`);
  }

  return {
    projectId: project.id,
    projectTitle: project.title,
    teamHealthScore,
    healthTier,
    healthLabel,
    healthBadge,
    breakdown: {
      roleFillPts: `${roleScore} / 40`,
      skillBalancePts: `${domainScore} / 30`,
      trustLevelPts: `${trustPoints} / 30`
    },
    teamMemberCount: members.length,
    domainMatrix,
    roleCoverage,
    missingSkills,
    recommendations,
    roleRecommendations
  };
}

module.exports = {
  analyzeTeam
};
