const Admin = require("./models/AdminModel");
const { InStudent } = require("./models/StudentModel");
const Teacher = require("./models/TeacherModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode ? res.statusCode : 500;

	res.status(statusCode);

	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === "production" ? null : err.stack,
	});
};

const protectAdmin = asyncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			req.admin = await Admin.findByEmail(decoded.email);
			next();
		} catch (error) {
			res.status(401);
			throw new Error("Not Authorised: Incorrect or Expired Token");
		}
	}
	if (!token) {
		res.status(401);
		throw new Error("Not Authorised. NO TOKEN");
	}
});

const protectInStudent = asyncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.student = await InStudent.findByEmail(decoded.email);
			next();
		} catch (error) {
			res.status(401);
			throw new Error("Not Authorised: Incorrect or Expired Token");
		}
	}
	if (!token) {
		res.status(401);
		throw new Error("Not Authorised. NO TOKEN");
	}
});

const protectTeacher = asyncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.teacher = await Teacher.findByEmail(decoded.email);
			next();
		} catch (error) {
			res.status(401);
			throw new Error("Not Authorised: Incorrect or Expired Token");
		}
	}
	if (!token) {
		res.status(401);
		throw new Error("Not Authorised. NO TOKEN");
	}
});

const protectParent = asyncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.parent = await InStudent.findByParentEmail(decoded.email);
			next();
		} catch (error) {
			res.status(401);
			throw new Error("Not Authorised: Incorrect or Expired Token");
		}
	}
	if (!token) {
		res.status(401);
		throw new Error("Not Authorised. NO TOKEN");
	}
});

module.exports = {
	protectTeacher,
	errorHandler,
	protectAdmin,
	protectInStudent,
	protectParent,
};
