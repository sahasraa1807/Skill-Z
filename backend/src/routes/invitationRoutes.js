const express = require('express');
const { body } = require('express-validator');
const invitationController = require('../controllers/invitationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  [
    body('projectId').isUUID().withMessage('Valid projectId is required'),
    body('receiverId').isUUID().withMessage('Valid receiverId is required'),
    body('roleName').notEmpty().withMessage('Role name is required')
  ],
  invitationController.sendInvitation
);

router.get('/received', invitationController.getReceivedInvitations);
router.get('/sent', invitationController.getSentInvitations);
router.put('/:id/accept', invitationController.acceptInvitation);
router.put('/:id/reject', invitationController.rejectInvitation);

module.exports = router;
