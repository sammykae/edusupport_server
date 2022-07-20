const rand = require("../IdGenerator");
const Admin = require("../models/AdminModel");
const AllUsers = require("../models/AllUserModel");
const Teachers = require("../models/TeacherModel");
const { InStudent } = require("../models/StudentModel");
const Quizzes = require("../models/QuizModel");
const Classes = require("../models/ClassModel");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const generateToken = require("../GenerateToken");

const getAdminData = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [admin, _] = await Admin.findByEmail(reqEmail);
	if (admin.length === 0) {
		res.status(404);
		throw new Error("Admin Not Found");
	}
	const { password, ...data } = admin[0];
	res.status(200).json(data);
});

const loginAdmin = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const [admin, _] = await Admin.findByEmail(email);

	if (
		admin.length !== 0 &&
		(await bcrypt.compare(password, admin[0].password))
	) {
		res.status(200).json({
			token: generateToken(admin[0].email),
			role: "admin",
		});
	} else {
		res.status(400);
		throw new Error("Invalid Credentials");
	}
});

const createAdmin = asyncHandler(async (req, res, next) => {
	let id = rand(10);
	const [userId, _] = await AllUsers.findById(id);
	while (userId.length > 0) {
		id = rand(10);
	}
	const {
		firstname,
		lastname,
		username,
		gender,
		email,
		phone,
		org_name,
		org_address,
		password,
	} = req.body;

	if (
		!firstname ||
		!lastname ||
		!username ||
		!gender ||
		!email ||
		!phone ||
		!org_name ||
		!org_address ||
		!password
	) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}
	const [user, __] = await AllUsers.findByUsername(username);

	if (user.length > 0) {
		res.status(400);
		throw new Error("Username Already Taken");
	}

	const [userEmail, ___] = await AllUsers.findByEmail(email);

	if (userEmail.length > 0) {
		res.status(400);
		throw new Error("User Already Exist. Try to Login.");
	}
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	let admin = new Admin(
		id,
		firstname,
		lastname,
		username,
		gender,
		email,
		phone,
		org_name,
		org_address,
		hashedPassword
	);

	await AllUsers.save(id, username, email);
	await Admin.createSub(id);
	await admin.save();
	const [newUser, ____] = await Admin.findByEmail(email);
	if (newUser) {
		res.status(201).json({
			message: "Account Created Successfully",
		});
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const updateAdmin = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [admin, _] = await Admin.findByEmail(reqEmail);

	const id = admin[0].admin_id;
	if (admin.length === 0) {
		res.status(400);
		throw new Error("Admin Not Found");
	}
	const {
		firstname,
		lastname,
		username,
		gender,
		email,
		phone,
		org_name,
		org_address,
		avatar,
	} = req.body;

	if (
		!id ||
		!firstname ||
		!lastname ||
		!username ||
		!gender ||
		!email ||
		!phone ||
		!org_name ||
		!org_address ||
		!avatar
	) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}
	const [user, __] = await AllUsers.findByUsername(username);

	if (user.length > 0 && user[0].username !== username) {
		res.status(400);
		throw new Error("Username Already Taken!");
	}

	const [userEmail, ___] = await AllUsers.findByEmail(email);

	if (userEmail.length > 0 && reqEmail !== userEmail[0].email) {
		res.status(400);
		throw new Error("Email Already Exists!");
	}

	await AllUsers.update(id, username, email);
	await Admin.update(
		id,
		firstname,
		lastname,
		username,
		gender,
		email,
		phone,
		org_name,
		org_address,
		avatar
	);
	const [newUser, ____] = await Admin.findByEmail(email);
	if (newUser) {
		res.status(200).json({
			token: generateToken(newUser[0].email),
			role: "admin",
		});
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const updatePassword = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [admin, _] = await Admin.findByEmail(reqEmail);

	const id = admin[0].admin_id;
	if (admin.length === 0) {
		res.status(400);
		throw new Error("Admin Not Found");
	}
	const { password } = req.body;

	if (!id || !password) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	await Admin.updatePassword(id, hashedPassword);
	const [newUser, ____] = await Admin.findByEmail(reqEmail);
	if (newUser) {
		res.status(200).json({
			message: "Password Updated Successfully",
		});
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const getSub = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [admin, _] = await Admin.findByEmail(reqEmail);
	if (admin.length === 0) {
		res.status(404);
		throw new Error("Admin Not Found");
	}
	const sub = await Admin.getPaid(admin[0].admin_id);

	res.status(200).json(sub);
});

const postSub = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [admin, _] = await Admin.findByEmail(reqEmail);
	if (admin.length === 0) {
		res.status(404);
		throw new Error("Admin Not Found");
	}

	const { dur, plan, ref } = req.body;

	if (!plan || !ref || !dur) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	let newDur = dur;
	if (plan === "supreme") {
		newDur = "1year";
	}

	const sub = await Admin.paid(admin[0].admin_id, plan, ref, newDur);
	if (sub.affectedRows > 0) {
		res.status(200).json({ data: [], message: "Subscription Successful" });
	} else {
		res
			.status(200)
			.json({ data: [], message: "An Error Occured. Subscription Failed!" });
	}
});

const getAllTeachers = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [admin, _] = await Admin.findByEmail(reqEmail);
	const aid = admin[0].admin_id;
	const [teachers, __] = await Teachers.findByAdminId(aid);
	if (teachers.length === 0) {
		res.status(400);
		throw new Error("No Teachers Found");
	} else {
		res.status(200).json({ data: teachers, message: "Teachers Found" });
	}
});

const getAllStudents = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [admin, _] = await Admin.findByEmail(reqEmail);
	const aid = admin[0].admin_id;
	const [students, __] = await InStudent.findByAdminId(aid);

	if (students.length === 0) {
		res.status(400);
		throw new Error("No Students Found");
	} else {
		res.status(200).json({ data: students, message: "Students Found" });
	}
});

const deleteStudent = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [admin, _] = await Admin.findByEmail(reqEmail);
	const aid = admin[0].admin_id;
	const [del, __] = await await InStudent.findById(req.params.id);
	if (del.length === 0) {
		res.status(200).json({ data: [], message: "Student Doesn't Exist!" });
	} else {
		const [student, ___] = await await InStudent.delete(aid, req.params.id);
		if (student.affectedRows > 0) {
			res
				.status(200)
				.json({ data: [], message: "Student Deleted Successfully!" });
		} else {
			res.status(200).json({ data: [], message: "Unable To Delete Student!" });
		}
	}
});

const deleteTeacher = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [admin, _] = await Admin.findByEmail(reqEmail);
	const aid = admin[0].admin_id;
	const [del, __] = await await Teachers.findById(req.params.id);
	if (del.length === 0) {
		res.status(200).json({ data: [], message: "Teacher Doesn't Exist!" });
	} else {
		const [teach, ___] = await await Teachers.delete(aid, req.params.id);
		if (teach.affectedRows > 0) {
			const [all, ___] = await await AllUsers.delete(req.params.id);
			if (all.affectedRows > 0) {
				res
					.status(200)
					.json({ data: [], message: "Teacher Deleted Successfully!" });
			} else {
				res
					.status(200)
					.json({ data: [], message: "Unable To Delete Teacher!" });
			}
		} else {
			res.status(200).json({ data: [], message: "Unable To Delete Teacher!" });
		}
	}
});

const getAllClasses = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [admin, _] = await Admin.findByEmail(reqEmail);
	const aid = admin[0].admin_id;
	const [classes, __] = await Classes.findByAdminId(aid);
	if (classes.length === 0) {
		res.status(400);
		throw new Error("No Classes Found");
	} else {
		res.status(200).json({ data: classes, message: "Classes Found" });
	}
});

const getAllQuizes = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [admin, _] = await Admin.findByEmail(reqEmail);
	const aid = admin[0].admin_id;
	const [quizes, __] = await Quizzes.findByAdminId(aid);
	if (quizes.length === 0) {
		res.status(400);
		throw new Error("No Quizzes Found");
	} else {
		res.status(200).json({ data: quizes, message: "Quizzes Found" });
	}
});

const getOrgName = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [admin, _] = await Admin.findByEmail(reqEmail);
	if (admin.length === 0) {
		res.status(404);
		throw new Error("Admin Not Found");
	} else {
		const [orgName, __] = await Admin.getOrgName(admin[0].admin_id);
		res
			.status(200)
			.json({ data: orgName[0], message: "Organization Name Found" });
	}
});

const getAllScore = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [admin, _] = await Admin.findByEmail(reqEmail);
	const aid = admin[0].admin_id;

	if (aid === null || aid === undefined) {
		res.status(400);
		throw new Error("Admin Not Found");
	}

	const [que, __] = await Quizzes.findByAdminId(aid);
	if (que.length > 0) {
		let quizzes = [];

		for (let off of que) {
			const [ques, __] = await Quizzes.getAllResultTeacher(off.quiz_id);
			if (ques.length > 0) {
				ques.map((q) => {
					quizzes.push(q);
				});
			}
		}

		res.status(200).json({ data: quizzes, message: "Results Found!" });
	} else {
		res.status(400);
		throw new Error("No Result Found!");
	}
});

const deleteScore = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [admin, _] = await Admin.findByEmail(reqEmail);
	const aid = admin[0].admin_id;

	if (aid === null || aid === undefined) {
		res.status(400);
		throw new Error("Admin Not Found");
	}
	const { id, sid } = req.params;

	const [del, __] = await Quizzes.deleteScore(id, sid);

	if (del.affectedRows > 0) {
		res.status(200).json({ data: [], message: "Result Deleted Successfully!" });
	} else {
		res.status(400);
		throw new Error("Error Deleting Result!");
	}
});

const getQuestion = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [student, _] = await Admin.findByEmail(reqEmail);
	const sid = student[0].admin_id;

	if (sid === null || sid === undefined) {
		res.status(400);
		throw new Error("Admin Not Found");
	}
	const { id } = req.params;

	if (!id) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const [que, __] = await Quizzes.getQuestionStudent(id);
	if (que.length > 0) {
		let newQue = [];
		for (const q of que) {
			newQue.push(q);
		}
		res.status(200).json({ data: newQue, message: "Questions Found!" });
	} else {
		res.status(200).json({ data: [], message: "No Question Found!" });
	}
});

const getSpellingQuestion = asyncHandler(async (req, res, next) => {
	const reqEmail = req.admin[0][0].email;
	const [student, _] = await Admin.findByEmail(reqEmail);
	const sid = student[0].admin_id;

	if (sid === null || sid === undefined) {
		res.status(400);
		throw new Error("Student Not Found");
	}
	const { id } = req.params;

	if (!id) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const [que, __] = await Quizzes.getSpellingQuestionStudent(id);
	if (que.length > 0) {
		let newQue = [];
		for (const q of que) {
			newQue.push(q);
		}
		res.status(200).json({ data: newQue, message: "Questions Found!" });
	} else {
		res.status(200).json({ data: [], message: "No Question Found!" });
	}
});

module.exports = {
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
	getQuestion,
	getSpellingQuestion,
};
