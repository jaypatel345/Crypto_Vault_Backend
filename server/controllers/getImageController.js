const UserModel = require('../models/User');
const { decryptData } = require('../utils/decryption');
const axios = require('axios');

// Pinata gateway URL for IPFS access
const PINATA_GATEWAY_URL = "https://gateway.pinata.cloud/ipfs/";

// Helper function to fetch encrypted data from IPFS via Pinata
async function returnIpfsResponse(ipfsHash) {
  const res = await axios(`${PINATA_GATEWAY_URL}${ipfsHash}`);
  return res.data;
}

// Main controller function
async function getImageController(req, res, next) {
  try {
    const address = req.address;
    const userAddress = address.toLowerCase();
    const user = await UserModel.findOne({ userAddress });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const { page, limit } = req.query;
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 4;

    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ message: "Invalid pagination values" });
    }

    const fullIpfsArray = Array.isArray(req.body?.ipfsHashArray)
      ? req.body.ipfsHashArray
      : [];

    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = Math.min(pageNumber * limitNumber, fullIpfsArray.length);
    const ipfsHashArray = fullIpfsArray.slice(startIndex, endIndex);
    const decryptedImageArr = [];

    if (ipfsHashArray.length > 0) {
      const encryptedDataArr = await Promise.all(
        ipfsHashArray.map(async (ipfsHash) => {
          try {
            const res = await returnIpfsResponse(ipfsHash);
            return res;
          } catch (error) {
            console.error(`Error fetching from IPFS [${ipfsHash}]:`, error.message);
            return null;
          }
        })
      );

      for (const img of encryptedDataArr) {
        if (!img || !img.encryptedData || !img.iv) {
          console.warn("Invalid image structure from IPFS:", img);
          continue;
        }

        try {
          const decryptedImgData = decryptData(img.encryptedData, img.iv, user.encryptionKey);
          if (decryptedImgData) {
            decryptedImageArr.push(decryptedImgData.toString('base64'));
          } else {
            console.error("Failed to decrypt image.");
          }
        } catch (error) {
          console.error("Image decryption failed:", error.message);
        }
      }
    }

    res.status(200).json({
      message: "Image Sent",
      decryptedImageArr: decryptedImageArr
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { getImageController };