const express = require("express");
const router = express.Router();
const uploadImageController = require('../controller/uploadimagecontroller.js');
const { uploadUserImage } = require("../middleware/multer.js");
const{authenticateToken}=require('../middleware/authenticatetoken.js');
router.post("/uploadimage",authenticateToken, uploadUserImage, uploadImageController);

module.exports = router