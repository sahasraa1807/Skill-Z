const prisma = require('../config/prisma');

exports.calculateConfidence = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      skills: true,
      interests: true,
      goals: true,
      preferences: true
    }
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  let score = 0;
  const breakdown = [];

  const addScore = (label, earned, points) => {
    if (earned) score += points;
    breakdown.push({ label, earned, points });
  };

  const prefs = user.preferences;

  addScore(
    'Profile completed (name, username, bio)',
    !!(user.name && user.username && user.bio),
    15
  );
  addScore(
    'At least 3 skills added',
    user.skills.length >= 3,
    20
  );
  addScore(
    'At least 2 interests selected',
    user.interests.length >= 2,
    15
  );
  addScore(
    'Goals set',
    user.goals.length > 0,
    10
  );
  addScore(
    'Availability filled in',
    !!(prefs && prefs.availabilityHours != null),
    10
  );
  addScore(
    'GitHub URL provided',
    !!(prefs && prefs.githubUrl),
    15
  );
  addScore(
    'Portfolio URL provided',
    !!(prefs && prefs.portfolioUrl),
    10
  );
  addScore(
    'LinkedIn URL provided',
    !!(prefs && prefs.linkedinUrl),
    5
  );

  return { score, breakdown };
};

