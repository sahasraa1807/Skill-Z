const prisma = require('../config/prisma');

exports.applyToProject = async (projectId, userId, message) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  if (project.ownerId === userId) {
    const error = new Error('Owner cannot apply to their own project');
    error.statusCode = 400;
    throw error;
  }
  if (project.status !== 'RECRUITING') {
    const error = new Error('Project is not recruiting');
    error.statusCode = 400;
    throw error;
  }

  const existingRequest = await prisma.joinRequest.findFirst({
    where: { projectId, userId }
  });

  if (existingRequest) {
    const error = new Error('You have already applied to this project');
    error.statusCode = 409;
    throw error;
  }

  const joinRequest = await prisma.joinRequest.create({
    data: {
      projectId,
      userId,
      message,
      status: 'PENDING'
    },
    include: {
      project: true,
      user: {
        select: { id: true, name: true, username: true, avatarUrl: true, email: true }
      }
    }
  });

  return joinRequest;
};

exports.getProjectApplications = async (projectId, ownerId) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  if (project.ownerId !== ownerId) {
    const error = new Error('Not authorized');
    error.statusCode = 403;
    throw error;
  }

  const applications = await prisma.joinRequest.findMany({
    where: { projectId },
    include: {
      user: {
        select: { id: true, name: true, username: true, avatarUrl: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return applications;
};

exports.acceptApplication = async (requestId, ownerId) => {
  return prisma.$transaction(async (tx) => {
    const request = await tx.joinRequest.findUnique({
      where: { id: requestId },
      include: { project: true }
    });

    if (!request) {
      const error = new Error('Request not found');
      error.statusCode = 404;
      throw error;
    }
    if (request.project.ownerId !== ownerId) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }
    if (request.status !== 'PENDING') {
      const error = new Error('Request is not pending');
      error.statusCode = 400;
      throw error;
    }

    const updatedRequest = await tx.joinRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' }
    });

    await tx.teamMember.create({
      data: {
        projectId: request.projectId,
        userId: request.userId,
        role: 'Member'
      }
    });

    return updatedRequest;
  });
};

exports.rejectApplication = async (requestId, ownerId) => {
  const request = await prisma.joinRequest.findUnique({
    where: { id: requestId },
    include: { project: true }
  });

  if (!request) {
    const error = new Error('Request not found');
    error.statusCode = 404;
    throw error;
  }
  if (request.project.ownerId !== ownerId) {
    const error = new Error('Not authorized');
    error.statusCode = 403;
    throw error;
  }
  if (request.status !== 'PENDING') {
    const error = new Error('Request is not pending');
    error.statusCode = 400;
    throw error;
  }

  const updatedRequest = await prisma.joinRequest.update({
    where: { id: requestId },
    data: { status: 'REJECTED' }
  });

  return updatedRequest;
};

exports.getMyApplications = async (userId) => {
  return prisma.joinRequest.findMany({
    where: { userId },
    include: {
      project: {
        include: {
          owner: {
            select: { id: true, name: true, username: true, avatarUrl: true, email: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};
