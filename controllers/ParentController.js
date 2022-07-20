const rand = require("../IdGenerator");
const { InStudent } = require("../models/StudentModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../GenerateToken");
const Quizzes = require("../models/QuizModel");

const login = asyncHandler(async (req, res, next) => {
	const { email } = req.body;
	if (!email) {
		res.status(400);
		throw new Error("Please Enter Your Email");
	}

	const [student, _] = await InStudent.findByParentEmail(email);
	if (student.length !== 0) {
		res.status(200).json({
			token: generateToken(email),
			role: "parent",
		});
	} else {
		res.status(400);
		throw new Error("Invalid Credentials");
	}
});

const getAllScore = asyncHandler(async (req, res, next) => {
	const reqEmail = req.parent[0][0].parent_email;

	const [student, _] = await InStudent.findByParentEmail(reqEmail);
	let ids = [];
	if (student.length !== 0) {
		student.map((st) => {
			ids.push(st.student_id);
		});
	}

	let result = [];
	for (let id of ids) {
		const [que, __] = await Quizzes.getAllResult(id);
		if (que.length !== 0) {
			que.map((q) => {
				result.push(q);
			});
		}
	}

	if (result.length > 0) {
		res.status(200).json({ data: result, message: "Results Found!" });
	} else {
		res.status(400);
		throw new Error("No Result Found!");
	}
});

module.exports = {
	login,
	getAllScore,
};
