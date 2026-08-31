const { validationResult } = require('express-validator');
const projectService = require('../services/projectService');
const joinRequestService = require('../services/joinRequestService');
const { success } = require('../utils/apiResponse');

exports.createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors;
    }
    const project = await projectService.createProject(req.user.userId, req.body);
    return success(res, project, 'Project created successfully', 201);
  } catch (err) {
    next(err);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const result = await projectService.getProjects(req.query);
    return success(res, result, 'Projects retrieved successfully');
  } catch (err) {
    next(err);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    return success(res, project, 'Project retrieved successfully');
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors;
    }
    const project = await projectService.updateProject(req.params.id, req.user.userId, req.body);
    return success(res, project, 'Project updated successfully');
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id, req.user.userId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.applyToProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors;
    }
    const request = await joinRequestService.applyToProject(req.params.id, req.user.userId, req.body.message);
    return success(res, request, 'Application submitted successfully', 201);
  } catch (err) {
    next(err);
  }
};

exports.getProjectApplications = async (req, res, next) => {
  try {
    const applications = await joinRequestService.getProjectApplications(req.params.id, req.user.userId);
    return success(res, applications, 'Applications retrieved successfully');
  } catch (err) {
    next(err);
  }
};

exports.acceptApplication = async (req, res, next) => {
  try {
    const request = await joinRequestService.acceptApplication(req.params.id, req.user.userId);
    return success(res, request, 'Application accepted successfully');
  } catch (err) {
    next(err);
  }
};

exports.rejectApplication = async (req, res, next) => {
  try {
    const request = await joinRequestService.rejectApplication(req.params.id, req.user.userId);
    return success(res, request, 'Application rejected successfully');
  } catch (err) {
    next(err);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await joinRequestService.getMyApplications(req.user.userId);
    return success(res, applications, 'My applications retrieved successfully');
  } catch (err) {
    next(err);
  }
};
