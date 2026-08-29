const prisma = require('../config/prisma');
const confidenceService = require('./profileConfidenceService');

exports.getUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      skills: { include: { skill: true } },
      interests: { include: { interest: true } },
      goals: true,
      preferences: true
    }
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

exports.updateProfile = async (userId, { name, bio, location, username }) => {
  if (username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== userId) {
      const error = new Error('Username already taken');
      error.statusCode = 409;
      throw error;
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, bio, location, username }
  });

  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

exports.updatePreferences = async (userId, data) => {
  return prisma.userPreferences.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data }
  });
};

exports.updateOnboardingStep = async (userId, step) => {
  return prisma.user.update({
    where: { id: userId },
    data: { onboardingStep: step },
    select: { id: true, onboardingStep: true }
  });
};

exports.completeOnboarding = async (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: { onboardingCompleted: true },
    select: { id: true, onboardingCompleted: true }
  });
};

exports.getMySkills = async (userId) => {
  return prisma.userSkill.findMany({
    where: { userId },
    include: { skill: true }
  });
};

exports.addSkill = async (userId, { skillId, proficiencyLevel }) => {
  return prisma.userSkill.create({
    data: {
      userId,
      skillId,
      proficiencyLevel
    },
    include: { skill: true }
  });
};

exports.removeSkill = async (userId, skillId) => {
  return prisma.userSkill.delete({
    where: { userId_skillId: { userId, skillId } }
  });
};

exports.updateSkillProficiency = async (userId, skillId, proficiencyLevel) => {
  return prisma.userSkill.update({
    where: { userId_skillId: { userId, skillId } },
    data: { proficiencyLevel },
    include: { skill: true }
  });
};

exports.setInterests = async (userId, interestIds) => {
  return prisma.$transaction(async (tx) => {
    await tx.userInterest.deleteMany({ where: { userId } });
    
    if (interestIds && interestIds.length > 0) {
      const data = interestIds.map(interestId => ({ userId, interestId }));
      await tx.userInterest.createMany({ data });
    }

    return tx.userInterest.findMany({
      where: { userId },
      include: { interest: true }
    });
  });
};

exports.getMyInterests = async (userId) => {
  return prisma.userInterest.findMany({
    where: { userId },
    include: { interest: true }
  });
};

exports.setGoals = async (userId, goals) => {
  return prisma.$transaction(async (tx) => {
    await tx.userGoal.deleteMany({ where: { userId } });

    if (goals && goals.length > 0) {
      const data = goals.map((goal) => ({ userId, goal }));
      await tx.userGoal.createMany({ data });
    }

    return tx.userGoal.findMany({ where: { userId } });
  });
};

exports.getMyGoals = async (userId) => {
  return prisma.userGoal.findMany({ where: { userId } });
};

exports.getConfidence = async (userId) => {
  return confidenceService.calculateConfidence(userId);
};
