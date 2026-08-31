const express = require('express');
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', projectController.getProjects);

// Protected routes that don't depend on /:id
router.get('/my/applications', authMiddleware, projectController.getMyApplications);
router.put('/applications/:id/accept', authMiddleware, projectController.acceptApplication);
router.put('/applications/:id/reject', authMiddleware, projectController.rejectApplication);

// Mix of public and protected routes that depend on /:id
router.get('/:id', projectController.getProjectById);

router.post(
  '/',
  authMiddleware,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('domain').notEmpty().withMessage('Domain is required'),
    body('projectType').notEmpty().withMessage('Project type is required'),
    body('duration').notEmpty().withMessage('Duration is required'),
    body('commitmentHours').isInt({ min: 1 }).withMessage('Commitment hours must be at least 1')
  ],
  projectController.createProject
);

router.put('/:id', authMiddleware, projectController.updateProject);
router.delete('/:id', authMiddleware, projectController.deleteProject);

router.post(
  '/:id/apply',
  authMiddleware,
  [
    body('message').optional().isString()
  ],
  projectController.applyToProject
);

router.get('/:id/applications', authMiddleware, projectController.getProjectApplications);

module.exports = router;
