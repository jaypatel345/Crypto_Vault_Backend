const express = require("express");
const router = express.Router();
const { uploadimagecontroller } = require("../controller/uploadimagecontroller.js");
const {uploadUserImage}=require("../middleware/multer.js")
router.post("/uploadimage", uploadUserImage, uploadimagecontroller);
module.exports = router;