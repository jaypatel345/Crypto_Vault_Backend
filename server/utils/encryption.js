const crypto = require('crypto');

// Encrypt file buffer using AES-256-CBC
const encryptFile = (buffer, key) => {
  const iv = crypto.randomBytes(16); // AES needs 16-byte IV
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

  return {
    encryptedData: encrypted,
    iv: iv
  };
};

module.exports = { encryptFile };
