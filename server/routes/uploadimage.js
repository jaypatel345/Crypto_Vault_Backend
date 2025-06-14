const express = require("express");
const router = express.Router();
const uploadImageController = require("../controller/uploadimagecontroller.js");
const { uploadUserImage } = require("../middleware/multer.js");
const { authenticatetoken } = require("../middleware/authenticatetoken.js"); 
router.post("/uploadimage", authenticatetoken, uploadUserImage, uploadImageController);

module.exports = router;