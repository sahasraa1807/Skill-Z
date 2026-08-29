const prisma = require('../config/prisma');

exports.getAllSkills = async () => {
  return prisma.skill.findMany();
};
