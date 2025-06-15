const jwt = require("jsonwebtoken");
const { JWT_SECRETKEY } = require("../config/serverConfig");

const authenticateToken = (req, res, next) => {
  // Accept JWT from the Authorization header as 'Bearer <token>'
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Access Token Required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRETKEY);
    req.address = decoded.address;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid Access Token" });
  }
};

module.exports = { authenticateToken };
