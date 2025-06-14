const UserModel = require("../models/user.js");
const { decryptData } = require("../utils/decryption.js");

const getImageController = async (req, res, next) => {
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
      return res.status(400).json({ message: "Pagination issue" });
    }

    // 🔐 Ensure body is a JSON array
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: "Expected request body to be an array of IPFS hashes" });
    }

    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = pageNumber * limitNumber;

    const ipfsHashArray = req.body.slice(startIndex, Math.min(req.body.length, endIndex));

    console.log("Requested IPFS Hashes:", ipfsHashArray);

    // Placeholder for decryption
    const decryptedImageArr = [];

    res.status(200).json({
      message: "Image Sent",
      data: decryptedImageArr,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getImageController };