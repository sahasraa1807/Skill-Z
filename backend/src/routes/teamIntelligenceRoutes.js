const express = require('express');
const router = express.Router();
const teamIntelligenceController = require('../controllers/teamIntelligenceController');

router.get('/project/:projectId', teamIntelligenceController.getProjectTeamIntelligence);

module.exports = router;
