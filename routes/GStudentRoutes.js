const express = require("express");

const router = express.Router();

const {
	gcreateStudent,
	gupdateStudent,
	gloginStudent,
	ggetStudentData,
	ggetQuizzes,
	updatePassword,
} = require("../controllers/GStudentController");
const { protectInStudent } = require("../MiddleWare");

router
	.route("/")
	.get(protectInStudent, ggetStudentData)
	.post(gcreateStudent)
	.put(protectInStudent, gupdateStudent);
router
	.route("/login")
	.post(gloginStudent)
	.put(protectInStudent, updatePassword);

router.route("/quiz").get(protectInStudent, ggetQuizzes);

module.exports = router;
