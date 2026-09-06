const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', workspaceController.getNotifications);
router.put('/:id/read', workspaceController.markNotificationRead);
router.put('/read-all', workspaceController.markAllNotificationsRead);

module.exports = router;
