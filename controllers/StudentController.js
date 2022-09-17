const rand = require("../IdGenerator");
const { InStudent } = require("../models/StudentModel");
const Admin = require("../models/AdminModel");
const AllUsers = require("../models/AllUserModel");
const Classes = require("../models/ClassModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const generateToken = require("../GenerateToken");
const Quizzes = require("../models/QuizModel");

const getStudentData = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await InStudent.findByEmail(reqEmail);
	if (student.length === 0) {
		res.status(404);
		throw new Error("Student Not Found");
	}
	const { password, ...data } = student[0];
	res.status(200).json({ data: data, message: "Student Data Found" });
});

const loginStudent = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const [student, _] = await InStudent.findByEmail(email);

	if (student.length !== 0 && student[0].student_type === "IN") {
		if (
			student.length !== 0 &&
			(await bcrypt.compare(password, student[0].password))
		) {
			res.status(200).json({
				token: generateToken(student[0].email),
				role: "student",
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

const createStudent = asyncHandler(async (req, res, next) => {
	let id = rand(10);
	const [userId, _] = await AllUsers.findById(id);
	while (userId.length > 0) {
		id = rand(10);
	}
	const {
		admin_id,
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
		!admin_id ||
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
	const [admin, _____] = await Admin.findById(admin_id);
	if (admin.length <= 0) {
		res.status(404);
		throw new Error("Invalid Admin Id");
	}

	const [paid, ______] = await InStudent.paid(admin_id);
	const ispaid = paid[0].plan;
	if (ispaid === "free") {
		const [teach, _] = await InStudent.findByAdminId(admin_id);
		if (teach.length >= 10) {
			res.status(400);
			throw new Error(
				"You have reached the maximum number of students.\nPlease upgrade your plan"
			);
		} else {
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
			let student = new InStudent(
				id,
				admin_id,
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
			await InStudent.createSub(id);
			await student.save();
			const [newUser, ____] = await InStudent.findByEmail(email);
			if (newUser) {
				res.status(201).json({
					message: "Account Created Successfully",
				});
			} else {
				res.status(400);
				throw new Error("An Error Occured");
			}
		}
	} else if (ispaid === "premium") {
		const [teach, _] = await InStudent.findByAdminId(admin_id);
		if (teach.length >= 100) {
			res.status(400);
			throw new Error(
				"You have reached the maximum number of students.\nPlease upgrade your plan"
			);
		} else {
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
			let student = new InStudent(
				id,
				admin_id,
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
			await InStudent.createSub(id);
			await student.save();
			const [newUser, ____] = await InStudent.findByEmail(email);
			if (newUser) {
				res.status(201).json({
					message: "Account Created Successfully",
				});
			} else {
				res.status(400);
				throw new Error("An Error Occured");
			}
		}
	} else if (ispaid === "deluxe") {
		const [teach, _] = await InStudent.findByAdminId(admin_id);
		if (teach.length >= 300) {
			res.status(400);
			throw new Error(
				"You have reached the maximum number of students.\nPlease upgrade your plan"
			);
		} else {
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
			let student = new InStudent(
				id,
				admin_id,
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
			await InStudent.createSub(id);
			await student.save();
			const [newUser, ____] = await InStudent.findByEmail(email);
			if (newUser) {
				res.status(201).json({
					message: "Account Created Successfully",
				});
			} else {
				res.status(400);
				throw new Error("An Error Occured");
			}
		}
	} else if (ispaid === "professional") {
		const [teach, _] = await InStudent.findByAdminId(admin_id);
		if (teach.length >= 1000) {
			res.status(400);
			throw new Error(
				"You have reached the maximum number of students.\nPlease upgrade your plan"
			);
		} else {
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
			let student = new InStudent(
				id,
				admin_id,
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
			await InStudent.createSub(id);
			await student.save();
			const [newUser, ____] = await InStudent.findByEmail(email);
			if (newUser) {
				res.status(201).json({
					message: "Account Created Successfully",
				});
			} else {
				res.status(400);
				throw new Error("An Error Occured");
			}
		}
	} else if (ispaid === "supreme") {
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
		let student = new InStudent(
			id,
			admin_id,
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
		await InStudent.createSub(id);
		await student.save();
		const [newUser, ____] = await InStudent.findByEmail(email);
		if (newUser) {
			res.status(201).json({
				message: "Account Created Successfully",
			});
		} else {
			res.status(400);
			throw new Error("An Error Occured");
		}
	}
});

const updateStudent = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await InStudent.findByEmail(reqEmail);

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

	await InStudent.update(
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
	const [newUser, ____] = await InStudent.findByEmail(email);
	if (newUser) {
		res.status(200).json({
			token: generateToken(newUser[0].email),
			role: "student",
		});
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const updatePassword = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await InStudent.findByEmail(reqEmail);

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

	await InStudent.updatePassword(id, hashedPassword);
	const [newUser, ____] = await InStudent.findByEmail(reqEmail);
	if (newUser) {
		res.status(200).json({
			message: "Password Updated Successfully",
		});
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const joinClass = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await InStudent.findByEmail(reqEmail);

	if (student.length <= 0) {
		res.status(400);
		throw new Error("Student Not Found");
	}
	const id = student[0].student_id;
	const { class_id } = req.body;

	if (!id || !class_id) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}
	const [classes, __] = await Classes.findById(class_id);

	if (classes.length <= 0) {
		res.status(400);
		throw new Error("Class Does Not Exist");
	}
	if (classes[0].status != "active") {
		res.status(400);
		throw new Error("Class clossed. Contact your teacher");
	}
	if (classes[0].admin_id != student[0].admin_id) {
		res.status(400);
		throw new Error("Class Not Found in Your Organisation");
	}
	let class_col = student[0].classes;
	if (class_col === "" || class_col === null) {
		await InStudent.joinClass(id, `${class_id}`);
		const [newUser, ____] = await InStudent.findByEmail(reqEmail);
		if (newUser) {
			res.status(200).json({
				data: newUser[0].classes,
				message: "Class Joined Successfully",
			});
		} else {
			res.status(400);
			throw new Error("An Error Occured");
		}
	} else {
		class_col = class_col.split(",");
		if (class_col.includes(class_id)) {
			res
				.status(200)
				.json({ data: class_col, message: "You are Already in this class" });
		} else {
			class_col.push(class_id);
			await InStudent.joinClass(id, class_col.toString());
			const [newUser, ____] = await InStudent.findByEmail(reqEmail);
			if (newUser) {
				res.status(200).json({
					data: newUser[0].classes,
					message: "Class Joined Successfully",
				});
			} else {
				res.status(400);
				throw new Error("An Error Occured");
			}
		}
	}
});

const getAllClasses = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;

	const [student, _] = await InStudent.findByEmail(reqEmail);

	let class_col = student[0].classes;
	if (class_col === "" || class_col === null) {
		res.status(400);
		throw new Error("No Classes Found");
	} else {
		class_col = class_col.split(",");
		let allClasses = [];
		for (let off of class_col) {
			const [classes, __] = await Classes.findById(off);
			if (classes.length > 0) {
				allClasses.push(classes[0]);
			}
		}

		if (allClasses.length <= 0) {
			res.status(400);
			throw new Error("No Classes Found");
		} else {
			res.status(200).json({ data: allClasses, message: "Classes Found" });
		}
	}
});

const LeaveClass = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const class_id = req.params.id;
	if (!class_id) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const [student, _] = await InStudent.findByEmail(reqEmail);
	const id = student[0].student_id;
	let class_col = student[0].classes;
	if (class_col === "" || class_col === null) {
		res.status(400);
		throw new Error("No Classes Found");
	} else {
		const find = class_col.indexOf(class_id);
		if (find < 0) {
			res.status(400);
			throw new Error("No Classes Found");
		} else {
			class_col = class_col.replace(`${class_id},`, "");
			class_col = class_col.replace(`,${class_id}`, "");
			class_col = class_col.replace(class_id, "");

			await InStudent.joinClass(id, class_col);
			const [newUser, ____] = await InStudent.findByEmail(reqEmail);
			if (newUser) {
				res.status(200).json({
					data: newUser[0].classes,
					message: "Successfully Left Class",
				});
			} else {
				res.status(400);
				throw new Error("An Error Occured");
			}
		}
	}
});

const getQuizzes = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;

	const [student, _] = await InStudent.findByEmail(reqEmail);

	let class_col = student[0].classes;
	let sid = student[0].student_id;
	let aid = student[0].admin_id;
	if (class_col === "" || class_col === null) {
		res.status(400);
		throw new Error("No Class Found. Join a class to take a Quiz ");
	} else {
		class_col = class_col.split(",");
		let allQuizzes = [];
		for (let off of class_col) {
			const [quiz, _] = await Quizzes.findQuizzesByClass(aid, off);

			if (quiz.length === 0) {
				continue;
			} else if (quiz.length >= 1) {
				quiz.forEach((element) => {
					if (element.status === "publish") {
						if (allQuizzes.length === 0) {
							allQuizzes.push(element);
						} else {
							let check = true;
							allQuizzes.map((all) => {
								if (all.quiz_id === element.quiz_id) {
									check = false;
								}
							});
							if (check) {
								allQuizzes.push(element);
							}
						}
					}
				});
			}
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
	}
});

const getStudentQuizData = asyncHandler(async (req, res, next) => {
	const quiz_id = req.params.id;

	const [quiz, _] = await Quizzes.findByIdStudent(quiz_id);
	if (quiz.length === 0) {
		res.status(404);
		throw new Error("Quiz Not Found");
	}

	res.status(200).json({ data: quiz[0], message: "Quiz Data Found" });
});

const getQuestion = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await InStudent.findByEmail(reqEmail);
	const sid = student[0].student_id;

	if (sid === null || sid === undefined) {
		res.status(400);
		throw new Error("Student Not Found");
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
			const { answers, ...data } = q;
			newQue.push(data);
		}
		res.status(200).json({ data: newQue, message: "Questions Found!" });
	} else {
		res.status(200).json({ data: [], message: "No Question Found!" });
	}
});

const getSpellingQuestion = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await InStudent.findByEmail(reqEmail);
	const sid = student[0].student_id;

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
			const { answers, ...data } = q;
			newQue.push(data);
		}
		res.status(200).json({ data: newQue, message: "Questions Found!" });
	} else {
		res.status(200).json({ data: [], message: "No Question Found!" });
	}
});

const score = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await InStudent.findByEmail(reqEmail);
	const sid = student[0].student_id;
	const sname = `${student[0].firstname} ${student[0].lastname}`;

	if (sid === null || sid === undefined) {
		res.status(400);
		throw new Error("Student Not Found");
	}
	const { quiz_id, answers, time_taken } = req.body;

	if (!quiz_id || !answers || !time_taken) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const [quiz, ___] = await Quizzes.findByIdStudent(quiz_id);

	if (quiz.length > 0) {
		let save = answers;
		const point = quiz[0].point;
		const pass_mark = quiz[0].pass_mark;
		const quiz_name = quiz[0].quiz_name;
		let student_point = 0;
		let rightQue = 0;
		let wrongQue;
		let student_grade = 0;
		let totalQue;
		let totalPoint;
		let status;

		if (quiz[0].quiz_type === "spelling") {
			const [questions, __] = await Quizzes.getSpellingQuestionStudent(quiz_id);
			totalQue = questions.length;
			totalPoint = totalQue * point;

			answers.map((e) => {
				questions.map((d) => {
					if (e.id === d.id) {
						if (e.word.toLowerCase() === d.word.toLowerCase()) {
							student_point += point;
							rightQue++;
						}
					}
				});
			});

			wrongQue = totalQue - rightQue;
			student_grade = (student_point / totalPoint) * 100;
			if (student_grade >= pass_mark) {
				status = "pass";
			} else {
				status = "fail";
			}
			const [score, ____] = await Quizzes.getResult(sid, quiz_id);
			if (score.length > 0) {
				res.status(200).json({
					data: {
						point: student_point,
						percent: Math.round(student_grade),
						right_answers: rightQue,
						wrong_answers: wrongQue,
						status: status,
						time_taken: time_taken,
					},
					message: "Quiz Already taken",
				});
			} else {
				const [result, ___] = await Quizzes.saveResult(
					sid,
					sname,
					quiz_id,
					quiz_name,
					student_point,
					student_grade,
					rightQue,
					wrongQue,
					status,
					time_taken,
					JSON.stringify(save).replaceAll("\\n", " ")
				);

				if (result.affectedRows > 0) {
					res.status(200).json({
						data: {
							point: student_point,
							percent: Math.round(student_grade),
							right_answers: rightQue,
							wrong_answers: wrongQue,
							status: status,
							time_taken: time_taken,
						},
						message: "Result Saved successfully!",
					});
				} else {
					res.status(400);
					throw new Error("Failed to save result");
				}
			}
		} else if (quiz[0].quiz_type === "normal") {
			const [questions, __] = await Quizzes.getQuestionStudent(quiz_id);
			totalQue = questions.length;
			totalPoint = totalQue * point;

			answers.map((e) => {
				questions.map((d) => {
					if (e.id === d.id) {
						if (d.type === "mc") {
							let check = true;
							if (d.answers.length === e.options.length) {
								d.answers.map((f) => {
									if (!e.options.includes(f)) {
										check = false;
									}
								});
								if (check) {
									student_point += point;
									rightQue++;
								}
							}
						} else if (d.type === "fg") {
							let check = true;
							let new_options = e.options.map((n) => {
								return n.toLowerCase();
							});
							let new_answers = d.answers.map((n) => {
								return n.toLowerCase();
							});

							if (d.answers.length === e.options.length) {
								for (let index = 0; index < new_options.length; index++) {
									const element = new_options[index];
									if (new_answers[index] !== element) {
										check = false;
									}
								}

								if (check) {
									student_point += point;
									rightQue++;
								}
							}
						} else if (d.type === "match") {
							if (d.answers.length === e.options.length) {
								let check = true;
								for (let index = 0; index < d.answers.length; index++) {
									if (d?.answers[index]?.match !== e?.options[index]?.match) {
										check = false;
									}
								}

								if (check) {
									student_point += point;
									rightQue++;
								}
							}
						} else {
							if (e.options === d.answers[0]) {
								student_point += point;
								rightQue++;
							}
						}
					}
				});
			});
			wrongQue = totalQue - rightQue;
			student_grade = (student_point / totalPoint) * 100;
			if (student_grade >= pass_mark) {
				status = "pass";
			} else {
				status = "fail";
			}

			const [score, ____] = await Quizzes.getResult(sid, quiz_id);
			if (score.length > 0) {
				res.status(200).json({
					data: {
						point: student_point,
						percent: Math.round(student_grade),
						right_answers: rightQue,
						wrong_answers: wrongQue,
						status: status,
						time_taken: time_taken,
					},
					message: "Quiz Already taken",
				});
			} else {
				const [result, ___] = await Quizzes.saveResult(
					sid,
					sname,
					quiz_id,
					quiz_name,
					student_point,
					student_grade,
					rightQue,
					wrongQue,
					status,
					time_taken,
					JSON.stringify(save).replaceAll("\\n", " ")
				);

				if (result.affectedRows > 0) {
					res.status(200).json({
						data: {
							point: student_point,
							percent: Math.round(student_grade),
							right_answers: rightQue,
							wrong_answers: wrongQue,
							status: status,
							time_taken: time_taken,
						},
						message: "Result Saved successfully!",
					});
				} else {
					res.status(400);
					throw new Error("Failed to save result");
				}
			}
		}
	} else {
		res.status(400);
		throw new Error("Quiz not found");
	}
});

const getAllScore = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await InStudent.findByEmail(reqEmail);
	const sid = student[0].student_id;

	if (sid === null || sid === undefined) {
		res.status(400);
		throw new Error("Student Not Found");
	}

	const [que, __] = await Quizzes.getAllResult(sid);
	if (que.length > 0) {
		res.status(200).json({ data: que, message: "Results Found!" });
	} else {
		res.status(400);
		throw new Error("No Result Found!");
	}
});

const getOrgName = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await InStudent.findByEmail(reqEmail);
	if (student.length === 0) {
		res.status(404);
		throw new Error("Admin Not Found");
	} else {
		const [orgName, __] = await Admin.getOrgName(student[0].admin_id);

		res
			.status(200)
			.json({ data: orgName[0], message: "Organization Name Found" });
	}
});

const getResultStatus = asyncHandler(async (req, res, next) => {
	const reqEmail = req.student[0][0].email;
	const [student, _] = await InStudent.findByEmail(reqEmail);
	const { quiz_id } = req.params;
	if (!quiz_id) {
		res.status(400);
		throw new Error("One or more parameters are missing");
	}
	if (student.length === 0) {
		res.status(404);
		throw new Error("Admin Not Found");
	}
	const sid = student[0].student_id;

	const [quiz, __] = await Quizzes.findByIdStudent(quiz_id);
	if (quiz.length === 0) {
		res.status(404);
		throw new Error("Quiz Not Found");
	}
	const [score, ____] = await Quizzes.getResult(sid, quiz_id);
	if (score.length > 0) {
		res.status(200).json({ data: true, message: "Quiz Already Taken" });
	} else {
		res.status(200).json({ data: false, message: "Quiz Available" });
	}
});

module.exports = {
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
};
