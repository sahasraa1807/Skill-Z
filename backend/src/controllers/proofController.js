const { addProjectProof, getUserProofs, deleteProjectProof } = require('../services/projectProofService');
const { verifySkillsFromGitHub } = require('../services/skillVerificationService');
const { success, error } = require('../utils/apiResponse');

/**
 * POST /api/proofs
 * Add a public project proof.
 */
exports.createProof = async (req, res, next) => {
  try {
    const userId = req.user.userId || req.user.id;
    const proof = await addProjectProof(userId, req.body);
    return success(res, proof, 'Project proof added successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/proofs/user/:username
 * Get public project proofs for a user.
 */
exports.getProofsByUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const proofs = await getUserProofs(username);
    return success(res, proofs, 'Project proofs retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/proofs/:id
 * Delete a project proof.
 */
exports.removeProof = async (req, res, next) => {
  try {
    const userId = req.user.userId || req.user.id;
    await deleteProjectProof(userId, req.params.id);
    return success(res, null, 'Project proof deleted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/proofs/verify-github
 * Trigger automatic skill verification against GitHub repositories.
 */
exports.verifySkills = async (req, res, next) => {
  try {
    const userId = req.user.userId || req.user.id;
    const result = await verifySkillsFromGitHub(userId);
    return success(res, result, 'Skill verification scan completed');
  } catch (err) {
    next(err);
  }
};
