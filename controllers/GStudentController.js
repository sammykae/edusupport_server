const rand = require("../IdGenerator");
const { GStudent } = require("../models/StudentModel");
const AllUsers = require("../models/AllUserModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const generateToken = require("../GenerateToken");
const Quizzes = require("../models/QuizModel");

const ggetStudentData = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await GStudent.findByEmail(reqEmail);
	if (student.length === 0) {
		res.status(404);
		throw new Error("Student Not Found");
	}
	const { password, ...data } = student[0];
	res.status(200).json({ data: data, message: "Student Data Found" });
});

const gloginStudent = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const [student, _] = await GStudent.findByEmail(email);

	if (student.length !== 0) {
		if (
			student.length !== 0 &&
			(await bcrypt.compare(password, student[0].password))
		) {
			res.status(200).json({
				token: generateToken(student[0].email),
				role: "gstudent",
			});
		} else {
			res.status(400);
			throw new Error("Invalid Credentials");
		}
	} else {
		res.status(400);
		throw new Error("Invalid Credentials");
	}
});

const gcreateStudent = asyncHandler(async (req, res, next) => {
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
		dob,
		student_type,
		password,
		parent_email,
	} = req.body;

	if (
		!firstname ||
		!lastname ||
		!username ||
		!gender ||
		!email ||
		!phone ||
		!dob ||
		!student_type ||
		!password ||
		!parent_email
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
		throw new Error("User Already Exist.");
	}
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	let student = new GStudent(
		id,
		firstname,
		lastname,
		username,
		gender,
		email,
		phone,
		dob,
		student_type,
		hashedPassword,
		parent_email
	);

	await AllUsers.save(id, username, email);
	await GStudent.createSub(id);
	await student.save();
	const [newUser, ____] = await GStudent.findByEmail(email);
	if (newUser) {
		res.status(201).json({
			message: "Account Created Successfully",
		});
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const gupdateStudent = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await GStudent.findByEmail(reqEmail);

	const id = student[0].student_id;
	if (student.length === 0) {
		res.status(400);
		throw new Error("Student Not Found");
	}
	const {
		firstname,
		lastname,
		username,
		gender,
		email,
		phone,
		dob,
		student_type,
		parent_email,
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
		!dob ||
		!student_type ||
		!parent_email ||
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

	await GStudent.update(
		id,
		firstname,
		lastname,
		username,
		gender,
		email,
		phone,
		dob,
		student_type,
		parent_email,
		avatar
	);
	const [newUser, ____] = await GStudent.findByEmail(email);
	if (newUser) {
		res.status(200).json({
			token: generateToken(newUser[0].email),
			role: "gstudent",
		});
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const updatePassword = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await GStudent.findByEmail(reqEmail);

	const id = student[0].student_id;
	if (student.length === 0) {
		res.status(400);
		throw new Error("Student Not Found");
	}
	const { password } = req.body;

	if (!id || !password) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	await GStudent.updatePassword(id, hashedPassword);
	const [newUser, ____] = await GStudent.findByEmail(reqEmail);
	if (newUser) {
		res.status(200).json({
			message: "Password Updated Successfully",
		});
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const ggetQuizzes = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;

	const [student, _] = await GStudent.findByEmail(reqEmail);
	if (student.length <= 0) {
		res.status(400);
		throw new Error("Student Doesn't Exist");
	}
	let sid = student[0].student_id;
	const [quiz, __] = await Quizzes.findAll();
	let allQuizzes = [];
	if (quiz.length > 0) {
		quiz.forEach((element) => {
			if (element.status === "publish" && element.admin_id === "SUPERADMIN") {
				allQuizzes.push(element);
			}
		});
	}

	if (allQuizzes.length <= 0) {
		res.status(400);
		throw new Error("No Quiz Found");
	} else {
		const [result, _] = await Quizzes.getAllResult(sid);
		let newQuizzes = [];
		if (result.length > 0) {
			allQuizzes.map((d) => {
				let temp = result.find((element) => element.quiz_id === d.quiz_id);
				if (temp) {
					newQuizzes.push({
						...d,
						taken: true,
					});
				} else {
					newQuizzes.push({
						...d,
						taken: false,
					});
				}
			});
		} else {
			allQuizzes.map((d) => {
				newQuizzes.push({
					...d,
					taken: false,
				});
			});
		}
		res.status(200).json({ data: newQuizzes, message: "Quizzes Found" });
	}
});

const getSub = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await GStudent.findByEmail(reqEmail);
	if (student.length === 0) {
		res.status(404);
		throw new Error("Student Not Found");
	}
	const sub = await GStudent.getPaid(student[0].student_id);

	res.status(200).json(sub);
});

const postSub = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await GStudent.findByEmail(reqEmail);
	if (student.length === 0) {
		res.status(404);
		throw new Error("Student Not Found");
	}

	const { dur, plan, ref } = req.body;

	if (!plan || !ref || !dur) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const sub = await GStudent.paid(student[0].student_id, plan, ref, dur);
	if (sub.affectedRows > 0) {
		res.status(200).json({ data: [], message: "Subscription Successful" });
	} else {
		res
			.status(200)
			.json({ data: [], message: "An Error Occured. Subscription Failed!" });
	}
});

module.exports = {
	gcreateStudent,
	gupdateStudent,
	gloginStudent,
	ggetStudentData,
	ggetQuizzes,
	updatePassword,
	getSub,
	postSub,
};
