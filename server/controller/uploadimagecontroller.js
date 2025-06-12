const { verifyMessage } = require("ethers");
const UserModel = require("../models/user.js");
const {
  PINATA_APIKEY,
  PINATA_SECRETKEY,
} = require("../config/serverConfig.js");
const generateEncryptionkey = require("../utils/genratekey.js");
const { encryptFile } = require("../utils/encryption.js");
const uploadImageController = async (req, res, next) => {
  try {
    console.log("Upload route hit");
    const address = "0xDF1236a46A0FbbeB1D924360b6a8be389B359881";
    const useraddress = address.toLowerCase();

    console.log("Looking for user with address:", useraddress);

    const user = await UserModel.findOne({ useraddress });

    if (!user) {
      console.log("User not found");
      throw new Error("user not found");
    }

    if (user.encryptionkey == null) {
      console.log("No encryption key found for user. Generating one...");
      const encryptionKey = generateEncryptionkey(64); // returns hex string
      user.encryptionkey = Buffer.from(encryptionKey, "hex");
      await user.save();
      console.log("Encryption key saved to database.");
    }

    if (!req.file) {
      console.log("No file received in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    const { encryptedData, iv } = encryptFile(
      req.file.buffer,
      user.encryptionkey
    );

    console.log("Encrypted buffer length:", encryptedData.length);

    const pinataSDK = require("@pinata/sdk");
    const pinata = new pinataSDK({
      pinataApiKey: PINATA_APIKEY,
      pinataSecretApiKey: PINATA_SECRETKEY,
    });

    const authResult = await pinata.testAuthentication();
    console.log("Pinata authentication successful:", authResult);

    res.status(200).json({
      message: "Successfully encrypted and authenticated",
      result: authResult,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      detail: error.message,
    });
  }
};

module.exports = uploadImageController;