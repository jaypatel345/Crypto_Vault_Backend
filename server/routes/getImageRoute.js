const express = require('express');
const router = express.Router();

const { getImageController } = require('../controllers/getImageController');
const { authenticateToken } = require('../middleware/authenticateToken');

// POST /api/getImage
router.post(
  '/getImage',
  authenticateToken,         // JWT authentication middleware
  getImageController         // Controller to fetch and decrypt images
);

module.exports = router;
