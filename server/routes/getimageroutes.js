const express = require("express");
const router = express.Router();
const { getImageController } = require("../controller/getImageController");
const{authenticateToken}=require('../middleware/authenticatetoken.js');

router.post("/getImage",authenticateToken,getImageController);

module.exports = router;