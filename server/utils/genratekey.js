const crypto = require('crypto');

// Function to generate a secure encryption key
const generateEncryptionkey = (length) => {
  return crypto.randomBytes(length / 2).toString('hex');
};

module.exports = { generateEncryptionkey };