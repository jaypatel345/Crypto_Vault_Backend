const express = require("express");
const router = express.Router();
const uploadImageController = require('../controller/uploadimagecontroller.js');
const { uploadUserImage } = require("../middleware/multer.js");

router.post("/uploadimage", uploadUserImage, uploadImageController);

module.exports = router