const { verifyMessage } = require("ethers");
const UserModel = require("../models/user.js");
const {
  PINATA_APIKEY,
  PINATA_SECRETKEY,
} = require("../config/serverConfig.js");
const { generateEncryptionkey } = require("../utils/genratekey.js");
const { encryptFile } = require("../utils/encryption.js");

const uploadimagecontroller = async (req, res, next) => {
  try {
    const address = "0xDF1236a46A0FbbeB1D924360b6a8be389B359881";
    const user = await UserModel.findOne({ useraddress: address });

    if (!user) {
      throw new Error("user not found");
    }

    if (user.encryptionkey == null) {
      const encryptionkey = generateEncryptionkey(64); // AES-256 requires 32-byte (64 hex)
      user.encryptionkey = Buffer.from(encryptionkey, "hex");
      await user.save();
    }

    if (!req.file) {
      console.log("No file received in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Encrypt the uploaded file
    const { encryptedData, iv } = encryptFile(
      req.file.buffer,
      user.encryptionkey
    );

    console.log("File received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

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
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
};

module.exports = { uploadimagecontroller };
