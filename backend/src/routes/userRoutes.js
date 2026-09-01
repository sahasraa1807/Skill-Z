const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public candidate exploration
router.get('/', userController.getCandidates);
router.get('/profile/:username', userController.getProfile);

// Protected routes
router.use(authMiddleware);

router.get('/dashboard', userController.getDashboard);


router.put('/profile', [
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('username').optional().matches(/^[a-z0-9_]+$/).isLength({ min: 3 }).withMessage('Username must be lowercase alphanumeric and underscores, min 3 chars')
], userController.updateProfile);

router.put('/preferences', userController.updatePreferences);
router.put('/onboarding/step', userController.updateOnboardingStep);
router.post('/onboarding/complete', userController.completeOnboarding);

router.get('/skills', userController.getMySkills);
router.post('/skills', [
  body('skillId').isUUID().withMessage('skillId must be a valid UUID'),
  body('proficiencyLevel').isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).withMessage('Invalid proficiency level')
], userController.addSkill);
router.delete('/skills/:skillId', userController.removeSkill);
router.put('/skills/:skillId', userController.updateSkillProficiency);

router.get('/interests', userController.getMyInterests);
router.post('/interests', userController.setInterests);

router.get('/goals', userController.getMyGoals);
router.post('/goals', userController.setGoals);

router.get('/confidence', userController.getConfidence);

module.exports = router;
