const { verifyMessage } = require("ethers");
const UserModel = require("../models/user.js");
const { PINATA_APIKEY, PINATA_SECRETKEY } = require("../config/serverConfig.js");

const uploadimagecontroller = async (req, res, next) => {
  try {
    if (!req.file) {
      console.warn("No file received in request.");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(" File received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    const pinataSDK = require("@pinata/sdk");
    const pinata = new pinataSDK({
      pinataApiKey: PINATA_APIKEY,
      pinataSecretApiKey: PINATA_SECRETKEY,
    });

    const authResult = await pinata.testAuthentication();
    console.log(" Pinata Auth Success:", authResult);

    res.status(200).json({
      message: "Successfully authenticated with Pinata",
      result: authResult,
    });
  } catch (error) {
    console.error(" Pinata Auth Failed:", error);
    res.status(500).json({ error: "Pinata authentication failed" });
  }
};

module.exports = { uploadimagecontroller };