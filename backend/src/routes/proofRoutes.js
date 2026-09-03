const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const proofController = require('../controllers/proofController');

router.post('/', authMiddleware, proofController.createProof);
router.get('/user/:username', proofController.getProofsByUser);
router.delete('/:id', authMiddleware, proofController.removeProof);
router.post('/verify-github', authMiddleware, proofController.verifySkills);

module.exports = router;
