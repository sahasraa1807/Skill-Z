const prisma = require('../config/prisma');

exports.createProject = async (ownerId, { title, description, domain, projectType, duration, commitmentHours, maxTeamSize, roles }) => {
  const project = await prisma.$transaction(async (tx) => {
    const createdProject = await tx.project.create({
      data: {
        title,
        description,
        domain,
        projectType,
        duration,
        commitmentHours,
        maxTeamSize,
        ownerId,
        teamMembers: {
          create: {
            userId: ownerId,
            role: 'Owner'
          }
        },
        roles: {
          create: (roles || []).map(r => ({
            roleName: r.roleName,
            openings: r.openings,
            skills: {
              create: (r.skillIds || []).map(skillId => ({
                skillId
              }))
            }
          }))
        }
      },
      include: {
        roles: {
          include: {
            skills: {
              include: {
                skill: true
              }
            }
          }
        },
        teamMembers: {
          include: {
            user: {
              select: { id: true, name: true, username: true, avatarUrl: true, email: true }
            }
          }
        },
        owner: {
          select: { id: true, name: true, username: true, avatarUrl: true, email: true }
        }
      }
    });
    return createdProject;
  });

  return project;
};

exports.getProjects = async ({ search, domain, projectType, status, page = 1, limit = 12 }) => {
  const skip = (page - 1) * limit;
  const where = {};
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (domain) where.domain = domain;
  if (projectType) where.projectType = projectType;
  where.status = status || 'RECRUITING';

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: parseInt(limit, 10),
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
        },
        _count: {
          select: { teamMembers: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.project.count({ where })
  ]);

  return { projects, total, page: parseInt(page, 10), totalPages: Math.ceil(total / limit) };
};

exports.getProjectById = async (projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: {
        select: { id: true, name: true, username: true, avatarUrl: true, email: true }
      },
      roles: {
        include: {
          skills: {
            include: { skill: true }
          }
        }
      },
      teamMembers: {
        include: {
          user: {
            select: { id: true, name: true, username: true, avatarUrl: true, email: true }
          }
        }
      },
      joinRequests: {
        include: {
          user: {
            select: { id: true, name: true, username: true, avatarUrl: true, email: true }
          }
        }
      },
      _count: true
    }
  });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  return project;
};

exports.updateProject = async (projectId, ownerId, data) => {
  const existingProject = await prisma.project.findUnique({ where: { id: projectId } });
  if (!existingProject) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  if (existingProject.ownerId !== ownerId) {
    const error = new Error('Not authorized to update this project');
    error.statusCode = 403;
    throw error;
  }

  const { roles, ...basicData } = data;

  if (roles) {
    return prisma.$transaction(async (tx) => {
      await tx.projectRole.deleteMany({ where: { projectId } });

      return tx.project.update({
        where: { id: projectId },
        data: {
          ...basicData,
          roles: {
            create: roles.map(r => ({
              roleName: r.roleName,
              openings: r.openings,
              skills: {
                create: (r.skillIds || []).map(skillId => ({
                  skillId
                }))
              }
            }))
          }
        },
        include: {
          owner: { select: { id: true, name: true, username: true, avatarUrl: true, email: true } },
          roles: { include: { skills: { include: { skill: true } } } },
          teamMembers: { include: { user: { select: { id: true, name: true, username: true, avatarUrl: true, email: true } } } }
        }
      });
    });
  } else {
    return prisma.project.update({
      where: { id: projectId },
      data: basicData,
      include: {
        owner: { select: { id: true, name: true, username: true, avatarUrl: true, email: true } },
        roles: { include: { skills: { include: { skill: true } } } },
        teamMembers: { include: { user: { select: { id: true, name: true, username: true, avatarUrl: true, email: true } } } }
      }
    });
  }
};

exports.deleteProject = async (projectId, ownerId) => {
  const existingProject = await prisma.project.findUnique({ where: { id: projectId } });
  if (!existingProject) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  if (existingProject.ownerId !== ownerId) {
    const error = new Error('Not authorized to delete this project');
    error.statusCode = 403;
    throw error;
  }

  await prisma.project.delete({ where: { id: projectId } });
};
