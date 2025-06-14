const multer = require('multer');

// Store file in memory for encryption
const storage = () => multer.memoryStorage();

module.exports = {
  uploadUserImage: multer({ storage: storage() }).single('file')  // file → must match frontend key
};