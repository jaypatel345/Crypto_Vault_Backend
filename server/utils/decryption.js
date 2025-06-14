const crypto = require('crypto');

/**
 * Decrypts encrypted data using AES-256-CBC algorithm.
 * 
 * @param {Buffer|Object} encryptedData - The encrypted data to decrypt. Can be a Buffer or an object representing a Buffer.
 * @param {Buffer|Object} iv - The initialization vector used during encryption. Can be a Buffer or an object representing a Buffer.
 * @param {Buffer|string} encryptionKey - The encryption key (must be 32 bytes for AES-256).
 * 
 * @returns {Buffer} The decrypted data as a Buffer.
 * 
 * @throws {Error} Throws an error if decryption fails or inputs are invalid.
 */
const decryptData = (encryptedData, iv, encryptionKey) => {
    try {
        // Convert iv to Buffer if it is an object representing a Buffer
        if (typeof iv === 'object' && iv !== null && iv.type === 'Buffer' && Array.isArray(iv.data)) {
            iv = Buffer.from(iv.data);
        }

        // Convert encryptedData to Buffer if it is an object representing a Buffer
        if (typeof encryptedData === 'object' && encryptedData !== null && encryptedData.type === 'Buffer' && Array.isArray(encryptedData.data)) {
            encryptedData = Buffer.from(encryptedData.data);
        }

        // Validate inputs
        if (!Buffer.isBuffer(iv)) {
            throw new TypeError('Invalid IV: must be a Buffer or a Buffer-like object');
        }
        if (!Buffer.isBuffer(encryptedData)) {
            throw new TypeError('Invalid encryptedData: must be a Buffer or a Buffer-like object');
        }
        if (!(Buffer.isBuffer(encryptionKey) || typeof encryptionKey === 'string')) {
            throw new TypeError('Invalid encryptionKey: must be a Buffer or a string');
        }

        // Ensure encryptionKey is a Buffer
        if (typeof encryptionKey === 'string') {
            encryptionKey = Buffer.from(encryptionKey, 'utf8');
        }

        // Check key length for AES-256 (should be 32 bytes)
        if (encryptionKey.length !== 32) {
            throw new Error('Invalid encryptionKey length: must be 32 bytes for AES-256');
        }

        // Create decipher instance
        const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);

        // Decrypt data
        const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

        return decryptedData;
    } catch (error) {
        // Re-throw error with a clear message
        throw new Error(`Decryption failed: ${error.message}`);
    }
};

module.exports = { decryptData };