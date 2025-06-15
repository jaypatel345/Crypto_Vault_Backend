const crypto = require('crypto');

const decryptData = (encryptedBase64, ivBase64, encryptionKeyHex) => {
  try {
    if (!encryptedBase64 || !ivBase64 || !encryptionKeyHex) {
      console.error("Missing decryption parameters");
      return null;
    }

    // Convert all to buffers
    const encryptedData = Buffer.from(encryptedBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');
    const key = Buffer.from(encryptionKeyHex, 'hex');

    if (iv.length !== 16) {
      console.error("Invalid IV length. Must be 16 bytes. Got:", iv.length);
      return null;
    }

    if (key.length !== 32) {
      console.error("Invalid key length. Must be 32 bytes (256 bits). Got:", key.length);
      return null;
    }

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error.message);
    return null;
  }
};

module.exports = { decryptData };
