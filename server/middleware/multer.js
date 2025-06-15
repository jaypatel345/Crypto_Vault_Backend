const multer = require('multer');

// Store file in memory for encryption
const storage = multer.memoryStorage();

const uploadUserImage = multer({ storage }).single('file'); // 'file' must match the frontend form key

module.exports = { uploadUserImage };
