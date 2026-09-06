const workspaceService = require('../services/workspaceService');
const { success, error } = require('../utils/apiResponse');

/**
 * GET /api/workspace/project/:projectId
 */
exports.getWorkspace = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const data = await workspaceService.getWorkspaceData(projectId, userId);
    return success(res, data, 'Workspace data loaded successfully');
  } catch (err) {
    if (err.message === 'Project not found') {
      return error(res, err.message, 404);
    }
    next(err);
  }
};

/**
 * POST /api/workspace/project/:projectId/tasks
 */
exports.createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const task = await workspaceService.createTask(projectId, userId, req.body);
    return success(res, task, 'Task created successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/workspace/tasks/:taskId
 */
exports.updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const updated = await workspaceService.updateTask(taskId, userId, req.body);
    return success(res, updated, 'Task updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/workspace/tasks/:taskId
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const result = await workspaceService.deleteTask(taskId, userId);
    return success(res, result, 'Task deleted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/workspace/project/:projectId/resources
 */
exports.addResource = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const resource = await workspaceService.addResource(projectId, userId, req.body);
    return success(res, resource, 'Resource link added successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/workspace/resources/:resourceId
 */
exports.deleteResource = async (req, res, next) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user.id;
    const result = await workspaceService.deleteResource(resourceId, userId);
    return success(res, result, 'Resource link removed successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/notifications
 */
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = await workspaceService.getUserNotifications(userId);
    return success(res, notifications, 'Notifications loaded');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/notifications/:id/read
 */
exports.markNotificationRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await workspaceService.markNotificationAsRead(id, userId);
    return success(res, null, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/notifications/read-all
 */
exports.markAllNotificationsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await workspaceService.markAllNotificationsAsRead(userId);
    return success(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};
