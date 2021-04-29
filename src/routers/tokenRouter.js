const express = require("express");
const router = express.Router();
const { getNewToken } = require("../controller/tokenController");

router.get("/", getNewToken);

module.exports = router;
