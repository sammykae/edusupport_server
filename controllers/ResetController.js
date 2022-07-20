const rand = require("../IdGenerator");
const Admin = require("../models/AdminModel");
const AllUsers = require("../models/AllUserModel");
const Teachers = require("../models/TeacherModel");
const { InStudent, GStudent } = require("../models/StudentModel");
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

var transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "efosajoseph@gmail.com",
		pass: "qzugshzcqajizayu",
	},
});

const sendResetEmail = (email, pass) => {
	var mailOptions = {
		from: "efosajoseph@gmail.com",
		to: `${email}`,
		subject: "Edusupport Password Reset",
		html: `<h1>Password Reset!!</h1>
        <p>Your Password has been reset</p>
        <p>New Password: <b>${pass}</b></p>
        <p>Please Login to your account with the reset password and change your password.</p>
        `,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
};

const reset = asyncHandler(async (req, res, next) => {
	const { email } = req.body;
	if (!email) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}
	const [userEmail, _] = await AllUsers.findByEmail(email);
	if (userEmail.length === 0) {
		res.status(404);
		throw new Error("User Not Found");
	} else {
		const pass = rand(8);
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(pass, salt);
		const [admin, _] = await Admin.findByEmail(email);
		if (admin.length > 0) {
			const [reset, _] = await Admin.updatePassword(
				admin[0].admin_id,
				hashedPassword
			);
			if (reset.affectedRows > 0) {
				sendResetEmail(email, pass);
				res.status(200).json({
					message: "A Reset Password Has Been Sent To Your Email.",
				});
			}
		} else {
			const [teacher, _] = await Teachers.findByEmail(email);
			if (teacher.length > 0) {
				const [reset, _] = await Teachers.updatePassword(
					teacher[0].teacher_id,
					hashedPassword
				);
				if (reset.affectedRows > 0) {
					sendResetEmail(email, pass);
					res.status(200).json({
						message: "A Reset Password Has Been Sent To Your Email.",
					});
				}
			} else {
				const [student, _] = await InStudent.findByEmail(email);
				if (student.length > 0) {
					const [reset, _] = await InStudent.updatePassword(
						student[0].student_id,
						hashedPassword
					);
					if (reset.affectedRows > 0) {
						sendResetEmail(email, pass);
						res.status(200).json({
							message: "A Reset Password Has Been Sent To Your Email.",
						});
					}
				} else {
					const [gstudent, _] = await GStudent.findByEmail(email);
					if (gstudent.length > 0) {
						const [reset, _] = await GStudent.updatePassword(
							gstudent[0].student_id,
							hashedPassword
						);
						if (reset.affectedRows > 0) {
							sendResetEmail(email, pass);
							res.status(200).json({
								message: "A Reset Password Has Been Sent To Your Email.",
							});
						}
					}
				}
			}
		}
	}
});

module.exports = { reset };
