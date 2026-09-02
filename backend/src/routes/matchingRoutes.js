const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const matchingController = require('../controllers/matchingController');

// Authenticated matching routes
router.get('/projects/:id/compatibility', authMiddleware, matchingController.getProjectCompatibility);
router.get('/recommended-projects', authMiddleware, matchingController.getRecommendedProjects);
router.get('/projects/:id/candidates', authMiddleware, matchingController.getRecommendedCandidates);

// GitHub profile stats route
router.get('/github/:username', matchingController.getGitHubStats);

module.exports = router;
