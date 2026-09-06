const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const authMiddleware = require('../middleware/authMiddleware');

// All workspace endpoints require authenticated user
router.use(authMiddleware);

// Workspace overview
router.get('/project/:projectId', workspaceController.getWorkspace);

// Tasks
router.post('/project/:projectId/tasks', workspaceController.createTask);
router.put('/tasks/:taskId', workspaceController.updateTask);
router.delete('/tasks/:taskId', workspaceController.deleteTask);

// Resources
router.post('/project/:projectId/resources', workspaceController.addResource);
router.delete('/resources/:resourceId', workspaceController.deleteResource);

module.exports = router;
