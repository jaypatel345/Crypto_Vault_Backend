const ethers = require("ethers");
const { verifyMessage } = require("ethers");
const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRETKEY } = require('../config/serverConfig');

async function authController(req, res, next) {
  try {
    const { signature } = req.body;
    const { address: queryAddress } = req.query;

    if (!signature) {
      return res.status(400).json({ message: "Signature is required" });
    }

    if (!queryAddress) {
      return res.status(400).json({ message: "Address query parameter is required" });
    }

    const recoveredAddress = verifyMessage("Welcome to Crypto Vault Website", signature);

    if (queryAddress.toLowerCase() !== recoveredAddress.toLowerCase()) {
      return res.status(401).json({ message: "Authentication failed: address mismatch" });
    }

    const normalizedAddress = recoveredAddress.toLowerCase();

    let user = await UserModel.findOne({ userAddress: normalizedAddress });
    if (!user) {
      user = await UserModel.create({ userAddress: normalizedAddress });
      console.log('New user created:', user);
    }

    const token = jwt.sign(
      { address: normalizedAddress },
      JWT_SECRETKEY,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    return res.status(200).json({ message: "Authentication successful", token });
  } catch (error) {
    console.error('AuthController error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { authController };
