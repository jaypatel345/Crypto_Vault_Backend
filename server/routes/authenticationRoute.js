const express = require('express');
const router = express.Router();

const { authController } = require('../controllers/authController');

// POST /api/authentication
router.post(
  '/authentication',
  authController             // Controller to handle wallet signature auth and JWT issuance
);

module.exports = router;
