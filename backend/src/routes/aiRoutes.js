const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/search/projects', aiController.searchProjects);
router.get('/search/people', aiController.searchPeople);
router.post('/analyze-project', aiController.analyzeProject);

module.exports = router;
