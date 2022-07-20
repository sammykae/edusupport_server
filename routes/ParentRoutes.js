const express = require("express");

const router = express.Router();

const { login, getAllScore } = require("../controllers/ParentController");
const { protectParent } = require("../MiddleWare");

router.route("/").get(protectParent, getAllScore).post(login);

module.exports = router;
