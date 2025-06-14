const express = require("express");
const router = express.Router();
const { getImageController } = require("../controller/getImageController.js");
const {authenticatetoken} = require('../middleware/authenticatetoken');
router.post("/getImage", authenticatetoken, getImageController);

module.exports = router;