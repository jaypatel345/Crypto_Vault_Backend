const { verifyMessage } = require("ethers");
const UserModel = require("../models/user.js");
const jwt = require("jsonwebtoken"); // ✅ Fix casing here
const { JWT_SECRETKEY } = require("../config/serverConfig.js");

async function authcontroller(req, res) {
  try {
    const { signature } = req.body;
    const { address } = req.query;

    if (!signature || !address) {
      return res.status(400).json({ error: "Missing signature or address" });
    }

    const message = "welcome to my application";
    const recoveredAddress = verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: "Signature verification failed" });
    }

    // Save user to DB if not exists
    const lowerAddress = recoveredAddress.toLowerCase();
    let user = await UserModel.findOne({ useraddress: lowerAddress });

    if (!user) {
      user = await UserModel.create({ useraddress: lowerAddress });
      console.log("New user created:", user);
    }

    // Generate JWT token
    const token = jwt.sign({ address: lowerAddress }, JWT_SECRETKEY, {
      expiresIn: "1h", // Optional: expires in 1 hour
    });

    return res.status(200).json({
      message: "Authentication Successful",
      token,
    });

  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { authcontroller };