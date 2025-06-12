const multer = require('multer');

const storage = multer.memoryStorage();

const uploadUserImage = multer({ storage }).single("file");

module.exports = { uploadUserImage };