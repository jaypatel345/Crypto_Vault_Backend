const express = require('express');
const router = express.Router();

const { uploadImageController } = require('../controllers/uploadImageController');
const { authenticateToken } = require('../middleware/authenticateToken');
const multer = require('multer');

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/uploadImage
router.post('/uploadImage', authenticateToken, upload.single('file'), uploadImageController);

module.exports = router;
