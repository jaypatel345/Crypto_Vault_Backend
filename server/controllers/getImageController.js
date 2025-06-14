const UserModel = require('../models/User');
const { decryptData } = require('../utils/decryption');
const axios = require('axios');
const PINATA_GATEWAY_URL = "https://gateway.pinata.cloud/ipfs/";

async function returnIpfsResponse(ipfsHash) {
  const res = await axios(`${PINATA_GATEWAY_URL}${ipfsHash}`);
  return res.data;
}

async function getImageController(req, res, next) {
  try {
    const address = req.address;
    const userAddress = address.toLowerCase();
    const user = await UserModel.findOne({ userAddress });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 1;

    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ message: "Invalid pagination values" });
    }

    const fullIpfsArray = req.body?.ipfsHashArray || [];

    console.log("Received IPFS Hashes:", fullIpfsArray); // ✅ Debug Log

    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = pageNumber * limitNumber;

    const ipfsHashArray = fullIpfsArray.slice(startIndex, Math.min(fullIpfsArray.length, endIndex));
    const decryptedImageArr = [];

    if (ipfsHashArray.length !== 0) {
      const encryptedDataArr = await Promise.all(ipfsHashArray.map(async (ipfsHash) => {
        const res = await returnIpfsResponse(ipfsHash);
        return res;
      }));

      for (const img of encryptedDataArr) {
        const decryptedImgData = decryptData(img.encryptedData, img.iv, user.encryptionKey);
        if (decryptedImgData) {
          decryptedImageArr.push(decryptedImgData.toString('base64'));
        }
      }
    }

    res.status(200).json({ message: "Image Sent", depcryptedImageArr: decryptedImageArr });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { getImageController };