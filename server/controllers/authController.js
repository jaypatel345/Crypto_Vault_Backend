const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const { JWT_SECRETKEY } = require('../config/serverConfig');

// ⚠️ WARNING: This bypasses signature verification (use only for testing!)
async function authController(req, res, next) {
  try {
    const { address: queryAddress } = req.query;

    if (!queryAddress) {
      return res.status(400).json({ message: "Address query parameter is required" });
    }

    const normalizedAddress = queryAddress.toLowerCase();

    // Check if user exists, else create
    let user = await UserModel.findOne({ userAddress: normalizedAddress });
    if (!user) {
      user = await UserModel.create({ userAddress: normalizedAddress });
      console.log('New user created:', user);
    }

    // Generate JWT
    const token = jwt.sign(
      { address: normalizedAddress },
      JWT_SECRETKEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: "Authentication successful (test mode, no signature check)",
      token
    });
  } catch (error) {
    console.error('AuthController error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { authController };