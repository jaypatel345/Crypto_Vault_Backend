const express = require("express");
const router = express.Router();
const { uploadimagecontroller } = require("../controller/uploadimagecontroller.js");

router.get("/uploadimage", uploadimagecontroller);

module.exports = router;