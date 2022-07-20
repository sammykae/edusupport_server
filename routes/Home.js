const express = require("express");
const router = express.Router();
const { home, viewAnswers } = require("../controllers/HomeController");

router.route("/").get(home);

router.route("/score/:id/:sid").get(viewAnswers);

module.exports = router;
