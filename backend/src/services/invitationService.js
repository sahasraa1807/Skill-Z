const prisma = require('../config/prisma');

exports.sendInvitation = async ({ projectId, senderId, receiverId, roleName, message }) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      teamMembers: true
    }
  });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  if (project.ownerId !== senderId) {
    const error = new Error('Only the project owner can send invitations');
    error.statusCode = 403;
    throw error;
  }

  if (receiverId === senderId) {
    const error = new Error('You cannot invite yourself');
    error.statusCode = 400;
    throw error;
  }

  // Check if receiver is already a team member
  const isAlreadyMember = project.teamMembers.some(m => m.userId === receiverId);
  if (isAlreadyMember) {
    const error = new Error('User is already a member of this project');
    error.statusCode = 400;
    throw error;
  }

  // Check if an invitation already exists
  const existingInvitation = await prisma.projectInvitation.findUnique({
    where: {
      projectId_receiverId: {
        projectId,
        receiverId
      }
    }
  });

  if (existingInvitation) {
    if (existingInvitation.status === 'PENDING') {
      const error = new Error('An invitation is already pending for this user');
      error.statusCode = 409;
      throw error;
    }

    // If previously rejected or withdrawn, update to PENDING
    return prisma.projectInvitation.update({
      where: { id: existingInvitation.id },
      data: {
        roleName,
        message,
        status: 'PENDING'
      },
      include: {
        project: true,
        receiver: {
          select: { id: true, name: true, username: true, avatarUrl: true }
        }
      }
    });
  }

  return prisma.projectInvitation.create({
    data: {
      projectId,
      senderId,
      receiverId,
      roleName,
      message,
      status: 'PENDING'
    },
    include: {
      project: true,
      receiver: {
        select: { id: true, name: true, username: true, avatarUrl: true }
      }
    }
  });
};

exports.getReceivedInvitations = async (userId) => {
  return prisma.projectInvitation.findMany({
    where: { receiverId: userId },
    include: {
      project: {
        include: {
          owner: {
            select: { id: true, name: true, username: true, avatarUrl: true }
          },
          roles: {
            include: {
              skills: {
                include: {
                  skill: true
                }
              }
            }
          }
        }
      },
      sender: {
        select: { id: true, name: true, username: true, avatarUrl: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

exports.getSentInvitations = async (userId) => {
  return prisma.projectInvitation.findMany({
    where: { senderId: userId },
    include: {
      project: true,
      receiver: {
        select: { id: true, name: true, username: true, avatarUrl: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

exports.acceptInvitation = async (invitationId, userId) => {
  return prisma.$transaction(async (tx) => {
    const invitation = await tx.projectInvitation.findUnique({
      where: { id: invitationId },
      include: { project: true }
    });

    if (!invitation) {
      const error = new Error('Invitation not found');
      error.statusCode = 404;
      throw error;
    }

    if (invitation.receiverId !== userId) {
      const error = new Error('Not authorized to accept this invitation');
      error.statusCode = 403;
      throw error;
    }

    if (invitation.status !== 'PENDING') {
      const error = new Error('Invitation is no longer pending');
      error.statusCode = 400;
      throw error;
    }

    const updatedInvitation = await tx.projectInvitation.update({
      where: { id: invitationId },
      data: { status: 'ACCEPTED' }
    });

    await tx.teamMember.create({
      data: {
        projectId: invitation.projectId,
        userId: invitation.receiverId,
        role: invitation.roleName || 'Member'
      }
    });

    return updatedInvitation;
  });
};

exports.rejectInvitation = async (invitationId, userId) => {
  const invitation = await prisma.projectInvitation.findUnique({
    where: { id: invitationId }
  });

  if (!invitation) {
    const error = new Error('Invitation not found');
    error.statusCode = 404;
    throw error;
  }

  if (invitation.receiverId !== userId) {
    const error = new Error('Not authorized to decline this invitation');
    error.statusCode = 403;
    throw error;
  }

  if (invitation.status !== 'PENDING') {
    const error = new Error('Invitation is no longer pending');
    error.statusCode = 400;
    throw error;
  }

  return prisma.projectInvitation.update({
    where: { id: invitationId },
    data: { status: 'REJECTED' }
  });
};
