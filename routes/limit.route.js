const express = require("express");
const { limitCheck } = require("../controllers/limit.controller.js");

const router = express.Router();

router.post("/check", limitCheck);

module.exports = router;
