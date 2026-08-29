const skillService = require('../services/skillService');
const { success } = require('../utils/apiResponse');

exports.getAllSkills = async (req, res, next) => {
  try {
    const skills = await skillService.getAllSkills();
    return success(res, skills, 'Skills retrieved successfully');
  } catch (err) {
    next(err);
  }
};
