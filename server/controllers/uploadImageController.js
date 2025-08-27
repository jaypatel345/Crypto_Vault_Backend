const ethers = require('ethers');
const UserModel = require('../models/user');
const { PINATA_APIKEY, PINATA_SECRETKEY } = require('../config/serverConfig');
const { generateEncryptionKey } = require('../utils/generatekey');
const { encryptFile } = require('../utils/encryption');
const pinataSDK = require('@pinata/sdk');

async function uploadImageController(req, res, next) {
  try {
    console.log("uploadImageController hit");
console.log("req.file:", req.file);
console.log("req.address:", req.address);
    const address = req.address;
    console.log("Received address:", address);

    if (!address) {
      return res.status(400).json({ message: "No wallet address provided" });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userAddress = address.toLowerCase();
    let user = await UserModel.findOne({ userAddress });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    if (!user.encryptionKey) {
      const encryptionKey = generateEncryptionKey(32); // returns hex string
      user.encryptionKey = encryptionKey;
      await user.save();
    }

    // Convert the hex key string to a Buffer for encryption
    const keyBuffer = Buffer.from(user.encryptionKey, "hex");

    const { encryptedData, iv } = encryptFile(req.file.buffer, keyBuffer);

    const pinata = new pinataSDK({ pinataApiKey: PINATA_APIKEY, pinataSecretApiKey: PINATA_SECRETKEY });

    const resPinata = await pinata.pinJSONToIPFS({
      encryptedData: encryptedData.toString('base64'),
      iv: iv.toString('base64')
    });

    res.status(200).json({
      ipfsHash: resPinata.IpfsHash,
      message: "Image Uploaded",
      imageUrl: `https://gateway.pinata.cloud/ipfs/${resPinata.IpfsHash}`
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = { uploadImageController };