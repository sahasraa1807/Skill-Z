const { analyzeTeam } = require('../services/teamIntelligenceService');
const { success, error } = require('../utils/apiResponse');

/**
 * GET /api/team-intelligence/project/:projectId
 * Evaluates team composition, missing skills, team health score (0-100%), and recommended candidates.
 */
exports.getProjectTeamIntelligence = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return error(res, 'Project ID parameter is required', 400);
    }

    const intelligence = await analyzeTeam(projectId);
    return success(res, intelligence, 'Team intelligence analysis generated successfully');
  } catch (err) {
    next(err);
  }
};
