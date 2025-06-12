const { verifyMessage } = require("ethers");
const UserModel = require("../models/user.js");

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

    console.log("Authenticated address:", recoveredAddress);
    res.status(200).json({ success: true, address: recoveredAddress });

  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { authcontroller };