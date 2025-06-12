const { verifyMessage } = require("ethers");
const UserModel = require("../models/user.js");
const {
  PINATA_APIKEY,
  PINATA_SECRETKEY,
} = require("../config/serverConfig.js");
const generateEncryptionkey = require("../utils/genratekey.js");
const { encryptFile } = require("../utils/encryption.js");
const stream = require("stream");
const FormData = require("form-data");
const fs = require("fs");

const uploadImageController = async (req, res, next) => {
  try {
    console.log("Upload route hit");
    const address = "0xDF1236a46A0FbbeB1D924360b6a8be389B359881";
    const useraddress = address.toLowerCase();

    const user = await UserModel.findOne({ useraddress });

    if (!user) {
      throw new Error("user not found");
    }

    if (user.encryptionkey == null) {
      const encryptionKey = generateEncryptionkey(64); // hex string
      user.encryptionkey = Buffer.from(encryptionKey, "hex");
      await user.save();
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

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

    const bufferStream = new stream.PassThrough();
    bufferStream.end(encryptedData);

    const metadata = {
      name: req.file.originalname,
      keyvalues: {
        iv: iv.toString("hex"),
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
      },
    };

    const options = {
      pinataMetadata: metadata,
      pinataOptions: {
        cidVersion: 1,
      },
    };

    const result = await pinata.pinFileToIPFS(bufferStream, options);

    console.log("Uploaded to Pinata:", result);

    res.status(200).json({
      message: "Encrypted file uploaded successfully",
      ipfsHash: result.IpfsHash,
      metadata: metadata.keyvalues,
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
