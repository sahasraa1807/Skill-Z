const { searchProjectsSemantically, searchPeopleSemantically, analyzeProject } = require('../services/aiSearchService');
const { success, error } = require('../utils/apiResponse');

/**
 * GET /api/ai/search/projects?q=query
 * Natural language semantic search for projects.
 */
exports.searchProjects = async (req, res, next) => {
  try {
    const query = req.query.q || req.query.search || '';
    if (!query || query.trim().length === 0) {
      return error(res, 'Search query parameter "q" is required', 400);
    }

    const limit = parseInt(req.query.limit, 10) || 10;
    const projects = await searchProjectsSemantically(query, limit);
    return success(res, { query, total: projects.length, projects }, 'Semantic project search successful');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/ai/search/people?q=query
 * Natural language semantic search for candidates.
 */
exports.searchPeople = async (req, res, next) => {
  try {
    const query = req.query.q || req.query.search || '';
    if (!query || query.trim().length === 0) {
      return error(res, 'Search query parameter "q" is required', 400);
    }

    const limit = parseInt(req.query.limit, 10) || 10;
    const candidates = await searchPeopleSemantically(query, limit);
    return success(res, { query, total: candidates.length, candidates }, 'Semantic candidate search successful');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/ai/analyze-project
 * AI Project Analysis evaluating description, tech stack, and suggested team roles.
 */
exports.analyzeProject = async (req, res, next) => {
  try {
    const { title, description, domain } = req.body;
    if (!description && !title) {
      return error(res, 'Title or description is required for AI project analysis', 400);
    }

    const analysis = await analyzeProject(title, description, domain);
    return success(res, analysis, 'AI project analysis generated successfully');
  } catch (err) {
    next(err);
  }
};
