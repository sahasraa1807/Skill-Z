const prisma = require('../config/prisma');

/**
 * Phase 8: Collaboration & Team Workspace Service
 * Manages Kanban tasks, project resource links, team activity feed, and notifications.
 */

/**
 * Fetch full workspace data for a project (Tasks, Resources, Activities, Members)
 */
async function getWorkspaceData(projectId, userId) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: {
        select: { id: true, name: true, username: true, avatarUrl: true, email: true }
      },
      teamMembers: {
        include: {
          user: {
            select: { id: true, name: true, username: true, avatarUrl: true, email: true }
          }
        }
      },
      tasks: {
        include: {
          assignee: {
            select: { id: true, name: true, username: true, avatarUrl: true }
          },
          creator: {
            select: { id: true, name: true, username: true, avatarUrl: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      resources: {
        orderBy: { createdAt: 'desc' }
      },
      activities: {
        include: {
          user: {
            select: { id: true, name: true, username: true, avatarUrl: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }
    }
  });

  if (!project) {
    throw new Error('Project not found');
  }

  // Check if user is owner or team member
  const isOwner = project.ownerId === userId;
  const isMember = project.teamMembers.some(tm => tm.userId === userId);

  // Group tasks by Kanban column status
  const tasksByStatus = {
    BACKLOG: project.tasks.filter(t => t.status === 'BACKLOG'),
    IN_PROGRESS: project.tasks.filter(t => t.status === 'IN_PROGRESS'),
    IN_REVIEW: project.tasks.filter(t => t.status === 'IN_REVIEW'),
    DONE: project.tasks.filter(t => t.status === 'DONE')
  };

  // Compile full team roster
  const teamRoster = [project.owner];
  project.teamMembers.forEach(tm => {
    if (tm.user && !teamRoster.some(u => u.id === tm.user.id)) {
      teamRoster.push(tm.user);
    }
  });

  return {
    project: {
      id: project.id,
      title: project.title,
      description: project.description,
      domain: project.domain,
      status: project.status,
      owner: project.owner
    },
    isOwner,
    isMember,
    teamRoster,
    tasksByStatus,
    totalTasks: project.tasks.length,
    completedTasks: tasksByStatus.DONE.length,
    resources: project.resources,
    activities: project.activities
  };
}

/**
 * Create a new task inside project workspace
 */
async function createTask(projectId, userId, data) {
  const { title, description, priority, assigneeId, dueDate } = data;

  if (!title || title.trim().length === 0) {
    throw new Error('Task title is required');
  }

  const task = await prisma.projectTask.create({
    data: {
      projectId,
      creatorId: userId,
      title: title.trim(),
      description: description ? description.trim() : null,
      priority: priority || 'MEDIUM',
      assigneeId: assigneeId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: 'BACKLOG'
    },
    include: {
      assignee: { select: { id: true, name: true, username: true, avatarUrl: true } },
      creator: { select: { id: true, name: true, username: true, avatarUrl: true } }
    }
  });

  // Log activity
  await prisma.projectActivity.create({
    data: {
      projectId,
      userId,
      type: 'TASK_CREATED',
      message: `created task: "${task.title}"`
    }
  });

  // If assigned to another user, send notification
  if (assigneeId && assigneeId !== userId) {
    await prisma.notification.create({
      data: {
        userId: assigneeId,
        title: 'New Task Assigned',
        message: `You were assigned task "${task.title}" in workspace`,
        link: `/projects/${projectId}/workspace`
      }
    });
  }

  return task;
}

/**
 * Update task (status change, reassignment, edit)
 */
async function updateTask(taskId, userId, updates) {
  const existing = await prisma.projectTask.findUnique({
    where: { id: taskId },
    include: { project: true }
  });

  if (!existing) {
    throw new Error('Task not found');
  }

  const updated = await prisma.projectTask.update({
    where: { id: taskId },
    data: {
      ...(updates.title && { title: updates.title.trim() }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.status && { status: updates.status }),
      ...(updates.priority && { priority: updates.priority }),
      ...(updates.assigneeId !== undefined && { assigneeId: updates.assigneeId || null }),
      ...(updates.dueDate !== undefined && { dueDate: updates.dueDate ? new Date(updates.dueDate) : null })
    },
    include: {
      assignee: { select: { id: true, name: true, username: true, avatarUrl: true } },
      creator: { select: { id: true, name: true, username: true, avatarUrl: true } }
    }
  });

  // Log status change activity
  if (updates.status && updates.status !== existing.status) {
    await prisma.projectActivity.create({
      data: {
        projectId: existing.projectId,
        userId,
        type: 'TASK_MOVED',
        message: `moved task "${updated.title}" to ${updates.status.replace('_', ' ')}`
      }
    });
  }

  return updated;
}

/**
 * Delete task
 */
async function deleteTask(taskId, userId) {
  const task = await prisma.projectTask.findUnique({ where: { id: taskId } });
  if (!task) {
    throw new Error('Task not found');
  }

  await prisma.projectTask.delete({ where: { id: taskId } });

  await prisma.projectActivity.create({
    data: {
      projectId: task.projectId,
      userId,
      type: 'TASK_DELETED',
      message: `deleted task "${task.title}"`
    }
  });

  return { success: true };
}

/**
 * Add a workspace resource link (GitHub repo, Figma, API docs, Live deployment)
 */
async function addResource(projectId, userId, data) {
  const { title, url, category } = data;
  if (!title || !url) {
    throw new Error('Resource title and URL are required');
  }

  const resource = await prisma.projectResource.create({
    data: {
      projectId,
      title: title.trim(),
      url: url.trim(),
      category: category || 'REPO'
    }
  });

  await prisma.projectActivity.create({
    data: {
      projectId,
      userId,
      type: 'RESOURCE_ADDED',
      message: `added resource link: "${resource.title}" (${resource.category})`
    }
  });

  return resource;
}

/**
 * Delete a resource link
 */
async function deleteResource(resourceId, userId) {
  const res = await prisma.projectResource.findUnique({ where: { id: resourceId } });
  if (!res) throw new Error('Resource not found');

  await prisma.projectResource.delete({ where: { id: resourceId } });
  return { success: true };
}

/**
 * Fetch notifications for user
 */
async function getUserNotifications(userId) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 30
  });
}

/**
 * Mark notification as read
 */
async function markNotificationAsRead(notificationId, userId) {
  return await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true }
  });
}

/**
 * Mark all notifications as read
 */
async function markAllNotificationsAsRead(userId) {
  return await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true }
  });
}

module.exports = {
  getWorkspaceData,
  createTask,
  updateTask,
  deleteTask,
  addResource,
  deleteResource,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
};
