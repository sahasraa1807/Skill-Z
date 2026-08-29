const prisma = require('../config/prisma');
const { success } = require('../utils/apiResponse');

exports.getAllInterests = async (req, res, next) => {
  try {
    const interests = await prisma.interest.findMany();
    return success(res, interests, 'Interests retrieved successfully');
  } catch (err) {
    next(err);
  }
};
