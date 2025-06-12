const express = require("express");
const router = express.Router();
const { authcontroller } = require("../controller/authcontroller.js");

router.post("/authentication", authcontroller);

module.exports = router;