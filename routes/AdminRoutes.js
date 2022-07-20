const express = require("express");

const router = express.Router();
const {
	getAdminData,
	createAdmin,
	getAllTeachers,
	getAllStudents,
	getAllQuizes,
	getAllClasses,
	updateAdmin,
	loginAdmin,
	deleteStudent,
	deleteTeacher,
	getSub,
	postSub,
	updatePassword,
	getOrgName,
	getAllScore,
	deleteScore,
	getSpellingQuestion,
	getQuestion,
} = require("../controllers/AdminController");
const { protectAdmin } = require("../MiddleWare");

router
	.route("/")
	.get(protectAdmin, getAdminData)
	.post(createAdmin)
	.put(protectAdmin, updateAdmin);
router.route("/login").post(loginAdmin).put(protectAdmin, updatePassword);

router.route("/teacher/").get(protectAdmin, getAllTeachers);

router.route("/student/").get(protectAdmin, getAllStudents);

router.route("/quiz/").get(protectAdmin, getAllQuizes);
router.route("/question/:id").get(protectAdmin, getQuestion);
router.route("/spelling/:id").get(protectAdmin, getSpellingQuestion);

router.route("/class/").get(protectAdmin, getAllClasses);
router.route("/teacher/:id").delete(protectAdmin, deleteTeacher);
router.route("/student/:id").delete(protectAdmin, deleteStudent);
router.route("/sub").get(protectAdmin, getSub).post(protectAdmin, postSub);

router.route("/org").get(protectAdmin, getOrgName);
router.route("/score").get(protectAdmin, getAllScore);

router.route("/score/:id/:sid").delete(protectAdmin, deleteScore);
module.exports = router;
