const express = require("express");

const router = express.Router();
const {
	createTeacher,
	getAllClasses,
	updateTeacher,
	loginTeacher,
	getTeacherData,
	createClass,
	deleteClass,
	createQuiz,
	deleteQuiz,
	getAllQuizes,
	updateQuiz,
	updateClass,
	setQuestion,
	deleteQuestion,
	getTeacherQuestion,
	getQuizData,
	setSpellingQuestion,
	deleteSpellingQuestion,
	getTeacherSpellingQuestion,
	getAllScore,
	updatePassword,
	getAllClassName,
	getOrgName,
	getStudentInClass,
	removeStudent,
	publishQuiz,
	updateDates,
	updateQuestion,
	updateSpellingQuestion,
} = require("../controllers/TeacherController");
const { protectTeacher } = require("../MiddleWare");

router
	.route("/")
	.get(protectTeacher, getTeacherData)
	.post(createTeacher)
	.put(protectTeacher, updateTeacher);
router.route("/login").post(loginTeacher).put(protectTeacher, updatePassword);

router
	.route("/class")
	.get(protectTeacher, getAllClasses)
	.post(protectTeacher, createClass)
	.put(protectTeacher, updateClass);

router
	.route("/quiz")
	.get(protectTeacher, getAllQuizes)
	.post(protectTeacher, createQuiz)
	.put(protectTeacher, updateQuiz);

router
	.route("/question")
	.put(protectTeacher, updateQuestion)
	.post(protectTeacher, setQuestion);
router.route("/question/:quiz_id").get(protectTeacher, getTeacherQuestion);
router.route("/question/:id/:quiz_id").delete(protectTeacher, deleteQuestion);

router
	.route("/spelling")
	.put(protectTeacher, updateSpellingQuestion)
	.post(protectTeacher, setSpellingQuestion);
router
	.route("/spelling/:quiz_id")
	.get(protectTeacher, getTeacherSpellingQuestion);
router
	.route("/spelling/:id/:quiz_id")
	.delete(protectTeacher, deleteSpellingQuestion);

router.route("/class/:id").delete(protectTeacher, deleteClass);
router
	.route("/quiz/:id")
	.get(protectTeacher, getQuizData)
	.delete(protectTeacher, deleteQuiz);

router.route("/score").get(protectTeacher, getAllScore);

router.route("/classname").get(protectTeacher, getAllClassName);
router.route("/org").get(protectTeacher, getOrgName);

router
	.route("/student")
	.post(protectTeacher, getStudentInClass)
	.put(protectTeacher, removeStudent);

router
	.route("/publish")
	.post(protectTeacher, publishQuiz)
	.put(protectTeacher, updateDates);

module.exports = router;
