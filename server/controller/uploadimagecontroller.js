const { verifyMessage } = require("ethers");
const UserModel = require("../models/user.js");
const { PINATA_API, PINATA_SECERTKEY } = require("../config/serverConfig.js");
async function uploadimagecontroller(req, res) {
  try {
    const pinataSDK = require("@pinata/sdk");
    const pinata = new pinataSDK({
      pinataApiKey: PINATA_APIKEY,
      pinataSecretApiKey: PINATA_SECRETKEY,
    });

    const result = await pinata.testAuthentication();
    console.log(" Pinata Auth Success:", result);

    res.status(200).json({
      message: "Successfully authenticated with Pinata",
      result,
    });
  } catch (error) {}
}

module.exports = { uploadimagecontroller };
