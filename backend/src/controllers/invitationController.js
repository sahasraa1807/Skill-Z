const { validationResult } = require('express-validator');
const invitationService = require('../services/invitationService');
const { success } = require('../utils/apiResponse');

exports.sendInvitation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors;
    }
    const { projectId, receiverId, roleName, message } = req.body;
    const invitation = await invitationService.sendInvitation({
      projectId: projectId || req.params.id,
      senderId: req.user.userId,
      receiverId,
      roleName,
      message
    });
    return success(res, invitation, 'Invitation sent successfully', 201);
  } catch (err) {
    next(err);
  }
};

exports.getReceivedInvitations = async (req, res, next) => {
  try {
    const invitations = await invitationService.getReceivedInvitations(req.user.userId);
    return success(res, invitations, 'Received invitations retrieved successfully');
  } catch (err) {
    next(err);
  }
};

exports.getSentInvitations = async (req, res, next) => {
  try {
    const invitations = await invitationService.getSentInvitations(req.user.userId);
    return success(res, invitations, 'Sent invitations retrieved successfully');
  } catch (err) {
    next(err);
  }
};

exports.acceptInvitation = async (req, res, next) => {
  try {
    const invitation = await invitationService.acceptInvitation(req.params.id, req.user.userId);
    return success(res, invitation, 'Invitation accepted successfully');
  } catch (err) {
    next(err);
  }
};

exports.rejectInvitation = async (req, res, next) => {
  try {
    const invitation = await invitationService.rejectInvitation(req.params.id, req.user.userId);
    return success(res, invitation, 'Invitation declined successfully');
  } catch (err) {
    next(err);
  }
};
