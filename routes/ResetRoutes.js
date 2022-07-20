const express = require("express");
const router = express.Router();
const { reset } = require("../controllers/ResetController");

router.route("/").post(reset);

module.exports = router;
