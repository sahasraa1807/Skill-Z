const prisma = require('../config/prisma');
const { calculateCompatibility, getRecommendedProjects, getRecommendedCandidates } = require('../services/matchingService');
const { getGitHubProfileStats } = require('../services/githubService');
const { success, error } = require('../utils/apiResponse');

/**
 * GET /api/matching/projects/:id/compatibility
 * Calculate match score between authenticated user and specified project.
 */
exports.getProjectCompatibility = async (req, res, next) => {
  try {
    const userId = req.user.userId || req.user.id;
    const projectId = req.params.id;

    const [user, project] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          skills: { include: { skill: true } },
          goals: true,
          preferences: true
        }
      }),
      prisma.project.findUnique({
        where: { id: projectId },
        include: {
          roles: {
            include: {
              skills: { include: { skill: true } }
            }
          }
        }
      })
    ]);

    if (!project) {
      return error(res, 'Project not found', 404);
    }

    const compatibility = calculateCompatibility(user, project);
    return success(res, compatibility, 'Compatibility calculated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/matching/recommended-projects
 * Get top recommended projects for logged in user.
 */
exports.getRecommendedProjects = async (req, res, next) => {
  try {
    const userId = req.user.userId || req.user.id;
    const limit = parseInt(req.query.limit, 10) || 4;

    const recommended = await getRecommendedProjects(userId, limit);
    return success(res, recommended, 'Recommended projects retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/matching/projects/:id/candidates
 * Get top recommended candidates for project owner.
 */
exports.getRecommendedCandidates = async (req, res, next) => {
  try {
    const userId = req.user.userId || req.user.id;
    const projectId = req.params.id;
    const limit = parseInt(req.query.limit, 10) || 4;

    // Verify user owns the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true }
    });

    if (!project) {
      return error(res, 'Project not found', 404);
    }

    if (project.ownerId !== userId) {
      return error(res, 'Only project owner can view recommended candidates', 403);
    }

    const candidates = await getRecommendedCandidates(projectId, limit);
    return success(res, candidates, 'Recommended candidates retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/matching/github/:username
 * Safe, cached public GitHub stats.
 */
exports.getGitHubStats = async (req, res, next) => {
  try {
    const { username } = req.params;
    const stats = await getGitHubProfileStats(username);
    return success(res, stats, 'GitHub stats retrieved');
  } catch (err) {
    next(err);
  }
};
