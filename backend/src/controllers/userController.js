const { validationResult } = require('express-validator');
const userService = require('../services/userService');
const { success } = require('../utils/apiResponse');

exports.getProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);
    return success(res, user, 'Profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors;
    }
    const user = await userService.updateProfile(req.user.userId, req.body);
    return success(res, user, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

exports.updatePreferences = async (req, res, next) => {
  try {
    const preferences = await userService.updatePreferences(req.user.userId, req.body);
    return success(res, preferences, 'Preferences updated successfully');
  } catch (err) {
    next(err);
  }
};

exports.updateOnboardingStep = async (req, res, next) => {
  try {
    const { step } = req.body;
    const user = await userService.updateOnboardingStep(req.user.userId, step);
    return success(res, user, 'Onboarding step updated');
  } catch (err) {
    next(err);
  }
};

exports.completeOnboarding = async (req, res, next) => {
  try {
    const user = await userService.completeOnboarding(req.user.userId);
    return success(res, user, 'Onboarding completed');
  } catch (err) {
    next(err);
  }
};

exports.getMySkills = async (req, res, next) => {
  try {
    const skills = await userService.getMySkills(req.user.userId);
    return success(res, skills, 'Skills retrieved successfully');
  } catch (err) {
    next(err);
  }
};

exports.addSkill = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors;
    }
    const skill = await userService.addSkill(req.user.userId, req.body);
    return success(res, skill, 'Skill added successfully', 201);
  } catch (err) {
    next(err);
  }
};

exports.removeSkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    await userService.removeSkill(req.user.userId, skillId);
    return success(res, null, 'Skill removed successfully');
  } catch (err) {
    next(err);
  }
};

exports.updateSkillProficiency = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    const { proficiencyLevel } = req.body;
    const skill = await userService.updateSkillProficiency(req.user.userId, skillId, proficiencyLevel);
    return success(res, skill, 'Skill proficiency updated');
  } catch (err) {
    next(err);
  }
};

exports.getMyInterests = async (req, res, next) => {
  try {
    const interests = await userService.getMyInterests(req.user.userId);
    return success(res, interests, 'Interests retrieved successfully');
  } catch (err) {
    next(err);
  }
};

exports.setInterests = async (req, res, next) => {
  try {
    const { interestIds } = req.body;
    const interests = await userService.setInterests(req.user.userId, interestIds);
    return success(res, interests, 'Interests set successfully');
  } catch (err) {
    next(err);
  }
};

exports.getMyGoals = async (req, res, next) => {
  try {
    const goals = await userService.getMyGoals(req.user.userId);
    return success(res, goals, 'Goals retrieved successfully');
  } catch (err) {
    next(err);
  }
};

exports.setGoals = async (req, res, next) => {
  try {
    const { goals } = req.body;
    const result = await userService.setGoals(req.user.userId, goals);
    return success(res, result, 'Goals set successfully');
  } catch (err) {
    next(err);
  }
};

exports.getConfidence = async (req, res, next) => {
  try {
    const confidence = await userService.getConfidence(req.user.userId);
    return success(res, confidence, 'Profile confidence calculated');
  } catch (err) {
    next(err);
  }
};

exports.getCandidates = async (req, res, next) => {
  try {
    const result = await userService.getCandidates(req.query);
    return success(res, result, 'Candidates retrieved successfully');
  } catch (err) {
    next(err);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const dashboard = await userService.getDashboard(req.user.userId);
    return success(res, dashboard, 'Dashboard data retrieved successfully');
  } catch (err) {
    next(err);
  }
};

