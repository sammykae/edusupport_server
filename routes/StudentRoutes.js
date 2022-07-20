const express = require("express");

const router = express.Router();
const {
	createStudent,
	getAllClasses,
	updateStudent,
	loginStudent,
	getStudentData,
	joinClass,
	LeaveClass,
	getQuizzes,
	getStudentQuizData,
	getQuestion,
	getSpellingQuestion,
	score,
	getAllScore,
	updatePassword,
	getOrgName,
	getResultStatus,
} = require("../controllers/StudentController");

const { protectInStudent } = require("../MiddleWare");

router
	.route("/")
	.get(protectInStudent, getStudentData)
	.post(createStudent)
	.put(protectInStudent, updateStudent);
router.route("/login").post(loginStudent).put(protectInStudent, updatePassword);

router
	.route("/class")
	.get(protectInStudent, getAllClasses)
	.post(protectInStudent, joinClass);

router.route("/quiz").get(protectInStudent, getQuizzes);
router.route("/quiz/:id").get(protectInStudent, getStudentQuizData);

router.route("/question/:id").get(protectInStudent, getQuestion);
router.route("/spelling/:id").get(protectInStudent, getSpellingQuestion);
router.route("/class/:id").delete(protectInStudent, LeaveClass);

router
	.route("/score")
	.get(protectInStudent, getAllScore)
	.post(protectInStudent, score);
router.route("/score/:quiz_id").get(protectInStudent, getResultStatus);

router.route("/org").get(protectInStudent, getOrgName);
module.exports = router;
