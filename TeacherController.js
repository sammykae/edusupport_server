const rand = require("../IdGenerator");
const Admin = require("../models/AdminModel");
const Teacher = require("../models/TeacherModel");
const AllUsers = require("../models/AllUserModel");
const Classes = require("../models/ClassModel");
const Quizzes = require("../models/QuizModel");
const { InStudent } = require("../models/StudentModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const generateToken = require("../GenerateToken");

const getTeacherData = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	if (teacher.length === 0) {
		res.status(404);
		throw new Error("Admin Not Found");
	}
	const { password, ...data } = teacher[0];
	res.status(200).json(data);
});

const loginTeacher = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const [teacher, _] = await Teacher.findByEmail(email);

	if (
		teacher.length !== 0 &&
		(await bcrypt.compare(password, teacher[0].password))
	) {
		res.status(200).json({
			token: generateToken(teacher[0].email),
			role: "teacher",
		});
	} else {
		res.status(400);
		throw new Error("Invalid Credentials");
	}
});

const createTeacher = asyncHandler(async (req, res, next) => {
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
		password,
	} = req.body;

	if (
		!admin_id ||
		!firstname ||
		!lastname ||
		!username ||
		!gender ||
		!email ||
		!phone ||
		!password
	) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const [admin, _____] = await Admin.findById(admin_id);

	if (admin.length <= 0) {
		res.status(404);
		throw new Error("Invalid Admin Id");
	}

	const [paid, ______] = await Teacher.paid(admin_id);
	const ispaid = paid[0].plan;
	if (ispaid === "free") {
		const [teach, _] = await Teacher.findByAdminId(admin_id);
		if (teach.length >= 2) {
			res.status(400);
			throw new Error(
				"You have reached the maximum number of teachers.\nPlease upgrade your plan"
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
				throw new Error("User Already Exist. Try to Login.");
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			let teacher = new Teacher(
				id,
				admin_id,
				firstname,
				lastname,
				username,
				gender,
				email,
				phone,
				hashedPassword
			);

			await AllUsers.save(id, username, email);

			await teacher.save();
			const [newUser, ____] = await Teacher.findByEmail(email);
			if (newUser) {
				res.status(201).json({
					message: "Account Created Successfully",
				});
			} else {
				res.status(400);
				throw new Error("An Error Occured");
			}
		}
	} else {
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
		let teacher = new Teacher(
			id,
			admin_id,
			firstname,
			lastname,
			username,
			gender,
			email,
			phone,
			hashedPassword
		);

		await AllUsers.save(id, username, email);

		await teacher.save();
		const [newUser, ____] = await Teacher.findByEmail(email);
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

const updateTeacher = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);

	if (teacher.length === 0) {
		res.status(400);
		throw new Error("Teacher Not Found");
	}
	const id = teacher[0].teacher_id;
	const { firstname, lastname, username, gender, email, phone, avatar } =
		req.body;

	if (
		!id ||
		!firstname ||
		!lastname ||
		!username ||
		!gender ||
		!email ||
		!phone ||
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
	await Teacher.update(
		id,
		firstname,
		lastname,
		username,
		gender,
		email,
		phone,
		avatar
	);
	const [newUser, ____] = await Teacher.findByEmail(email);
	if (newUser) {
		res.status(200).json({
			token: generateToken(newUser[0].email),
			role: "teacher",
		});
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const updatePassword = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);

	if (teacher.length === 0) {
		res.status(400);
		throw new Error("Teacher Not Found");
	}
	const id = teacher[0].teacher_id;
	const { password } = req.body;

	if (!id || !password) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	await Teacher.updatePassword(id, hashedPassword);
	const [newUser, ____] = await Teacher.findByEmail(reqEmail);
	if (newUser) {
		res.status(200).json({
			message: "Password Updated Successfully",
		});
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const createClass = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, __] = await Teacher.findByEmail(reqEmail);
	const aid = teacher[0].admin_id;

	const tid = teacher[0].teacher_id;
	const tname = `${teacher[0].firstname} ${teacher[0].lastname}`;

	const { class_name, status, subject } = req.body;

	if (!class_name || !status || !subject) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	let id = rand(10);
	const [classId, _] = await Classes.findById(id);
	while (classId.length > 0) {
		id = rand(10);
	}
	let newClassName = class_name.toUpperCase();
	const [className, ___] = await Classes.findClassName(newClassName, aid);
	if (className.length > 0) {
		res.status(400);
		throw new Error("Class Name Already Exists");
	}

	const [paid, ____] = await Teacher.paid(aid);
	const ispaid = paid[0].plan;
	if (ispaid === "free") {
		const [classes, _____] = await Classes.findByAdminId(aid);
		if (classes.length >= 2) {
			res.status(400);
			throw new Error(
				"You have reached the maximum number of classes.\nPlease upgrade your plan"
			);
		} else {
			await Classes.save(id, aid, tid, newClassName, status, subject, tname);
			const [classes, ___] = await Classes.findById(id);
			if (classes.length === 0) {
				res.status(400);
				throw new Error("Error Creating Class");
			} else {
				res
					.status(200)
					.json({ data: classes, message: "Class Created Successfully!" });
			}
		}
	} else {
		await Classes.save(id, aid, tid, newClassName, status, subject, tname);
		const [classes, ___] = await Classes.findById(id);
		if (classes.length === 0) {
			res.status(400);
			throw new Error("Error Creating Class");
		} else {
			res
				.status(200)
				.json({ data: classes, message: "Class Created Successfully!" });
		}
	}
});

const getAllClasses = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const [classes, __] = await Classes.findByTeacherId(tid);
	if (classes.length === 0) {
		res.status(400);
		throw new Error("No Classes Found");
	} else {
		res.status(200).json({ data: classes, message: "Classes Found!" });
	}
});

const getAllClassName = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const [classes, __] = await Classes.findByClassName(tid);
	if (classes.length === 0) {
		res.status(400);
		throw new Error("No Classes Found");
	} else {
		res.status(200).json({ data: classes, message: "Classes Found!" });
	}
});

const updateClass = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const aid = teacher[0].admin_id;
	const { class_id, class_name, status, subject } = req.body;
	if (!class_id || !class_name || !status || !subject) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}
	const [classes, __] = await Classes.findById(class_id);
	if (classes.length > 0) {
		let newClassName = class_name.toUpperCase();
		if (classes[0].class_name !== newClassName) {
			const [className, ___] = await Classes.findClassName(newClassName, aid);
			if (className.length > 0) {
				res.status(400);
				throw new Error("Class Name Already Exists");
			}
		}

		const [newQuiz, ____] = await Classes.update(
			class_id,
			tid,
			newClassName,
			status,
			subject
		);

		if (newQuiz.affectedRows > 0) {
			res.status(200).json({
				data: [],
				message: "Class Data Updated Successfully!",
			});
		} else {
			res.status(400);
			throw new Error("An Error Occured");
		}
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const deleteClass = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const [del, __] = await await Classes.findById(req.params.id);
	if (del.length <= 0) {
		res.status(400);
		throw new Error("Class Doesn't Exist!");
	} else {
		const [classes, ___] = await await Classes.delete(tid, req.params.id);
		if (classes.affectedRows > 0) {
			res
				.status(200)
				.json({ data: [], message: "Class Deleted Successfully!" });
		} else {
			res.status(400);
			throw new Error("Unable To Delete Class!");
		}
	}
});

const createQuiz = asyncHandler(async (req, res, next) => {
	const {
		quiz_name,
		no_level,
		dur_level,
		subject,
		point,
		pass_mark,
		class_name,
		quiz_type,
		can_reload,
		category,
	} = req.body;

	if (
		!quiz_name ||
		!no_level ||
		!dur_level ||
		!subject ||
		!point ||
		!pass_mark ||
		!class_name ||
		!quiz_type ||
		!can_reload ||
		!category
	) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}
	const reqEmail = req.teacher[0][0].email;
	const [teacher, __] = await Teacher.findByEmail(reqEmail);
	const aid = teacher[0].admin_id;
	const tid = teacher[0].teacher_id;
	const tname = `${teacher[0].firstname} ${teacher[0].lastname}`;

	let id = rand(10);
	const [quizId, _] = await Quizzes.findById(tid, id);
	while (quizId.length > 0) {
		id = rand(10);
	}

	let newQuizName = quiz_name.toUpperCase();
	const [className, ___] = await Quizzes.findQuizName(newQuizName, aid);
	if (className.length > 0) {
		res.status(400);
		throw new Error("Quiz Name Already Exists");
	}
	let check = true;
	let all = [];
	for (const que in class_name) {
		const [del, ___] = await Classes.findIdByName(class_name[que], tid);

		if (del.length === 0) {
			check = false;
		} else {
			all.push(del[0].class_id);
		}
	}

	if (!check) {
		res.status(400);
		throw new Error("One Or Class Doesn't Exist!");
	} else {
		const [paid, ____] = await Teacher.paid(aid);
		const ispaid = paid[0].plan;
		console.log(ispaid);
		if (ispaid === "free") {
			if (no_level > 1) {
				res.status(400);
				throw new Error("Organisation Not Subscribed. Max Level is One");
			}
			const [quiz, _____] = await Quizzes.findByAdminId(aid);
			if (quiz.length >= 2) {
				res.status(400);
				throw new Error(
					"You have reached the maximum number of quizzes.\nPlease upgrade your plan"
				);
			} else {
				all = JSON.stringify(all);

				const [quizzes, ___] = await Quizzes.save(
					id,
					aid,
					tid,
					newQuizName,
					no_level,
					dur_level,
					subject,
					point,
					pass_mark,
					all,
					JSON.stringify(class_name),
					quiz_type,
					can_reload,
					JSON.stringify(category),
					tname
				);
				if (quizzes.affectedRows > 0) {
					res.status(200).json({
						data: [
							{
								quiz_id: id,
								admin_id: aid,
								teacher_id: tid,
								quiz_name: newQuizName,
								no_level: Number(no_level),
								dur_level: Number(dur_level),
								subject: subject,
								point: Number(point),
								pass_mark: Number(pass_mark),
								class_id: JSON.parse(all),
								class_name: class_name,
								quiz_type: quiz_type,
								can_reload: can_reload,
								category: category,
								created_by: tname,
							},
						],
						message: "Quiz Created Successfully!",
					});
				} else {
					res.status(400);
					throw new Error("Error Creating Quiz");
				}
			}
		} else {
			all = JSON.stringify(all);

			const [quizzes, ___] = await Quizzes.save(
				id,
				aid,
				tid,
				newQuizName,
				no_level,
				dur_level,
				subject,
				point,
				pass_mark,
				all,
				JSON.stringify(class_name),
				quiz_type,
				can_reload,
				JSON.stringify(category),
				tname
			);
			if (quizzes.affectedRows > 0) {
				res.status(200).json({
					data: [
						{
							quiz_id: id,
							admin_id: aid,
							teacher_id: tid,
							quiz_name: newQuizName,
							no_level: Number(no_level),
							dur_level: Number(dur_level),
							subject: subject,
							point: Number(point),
							pass_mark: Number(pass_mark),
							class_id: JSON.parse(all),
							class_name: class_name,
							quiz_type: quiz_type,
							can_reload: can_reload,
							category: category,
							created_by: tname,
						},
					],
					message: "Quiz Created Successfully!",
				});
			} else {
				res.status(400);
				throw new Error("Error Creating Quiz");
			}
		}
	}
});

const publishQuiz = asyncHandler(async (req, res, next) => {
	const { quiz_id } = req.body;

	if (!quiz_id) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}
	const reqEmail = req.teacher[0][0].email;
	const [teacher, __] = await Teacher.findByEmail(reqEmail);
	const aid = teacher[0].admin_id;
	const tid = teacher[0].teacher_id;

	const [quiz, ___] = await Quizzes.findById(tid, quiz_id);
	if (quiz.length === 0) {
		res.status(400);
		throw new Error("Quiz Doesn't Exist");
	}
	if (quiz[0].status === "publish") {
		res.status(400);
		throw new Error("Quiz Already Published");
	}
	const [publish, ____] = await Quizzes.publish(aid, tid, quiz_id);
	if (publish.affectedRows > 0) {
		res.status(200).json({ message: "Quiz Published Successfully!" });
	} else {
		res.status(400);
		throw new Error("Error Publishing Quiz");
	}
});

const getAllQuizes = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const [quizes, __] = await Quizzes.findByTeacherId(tid);
	if (quizes.length === 0) {
		res.status(400);
		throw new Error("No Quizzes Found");
	} else {
		res.status(200).json({ data: quizes, message: "Quizes Found!" });
	}
});

const getQuizData = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const [quizes, __] = await Quizzes.findById(tid, req.params.id);
	if (quizes.length === 0) {
		res.status(400);
		throw new Error("No Quiz Data Found");
	} else {
		res.status(200).json({ data: quizes, message: "Quize Found!" });
	}
});

const updateQuiz = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const aid = teacher[0].admin_id;
	const [paid, ___] = await Teacher.paid(aid);

	const ispaid = paid[0].plan;

	const {
		quiz_id,
		quiz_name,
		no_level,
		dur_level,
		subject,
		point,
		pass_mark,
		class_name,
		status,
		quiz_type,
		can_reload,
		category,
	} = req.body;
	if (
		!quiz_id ||
		!quiz_name ||
		!no_level ||
		!dur_level ||
		!subject ||
		!point ||
		!pass_mark ||
		!class_name ||
		!status ||
		!quiz_type ||
		!can_reload ||
		!category
	) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const [qq, _______] = await Quizzes.findByIdStudent(quiz_id);
	if (qq.length > 0) {
		let newQuizName = quiz_name.toUpperCase();
		if (qq[0].quiz_name !== newQuizName) {
			const [className, ____] = await Quizzes.findQuizName(newQuizName, aid);
			if (className.length > 0) {
				res.status(400);
				throw new Error("Quiz Name Already Exists");
			} else {
				let check = true;
				let all = [];
				for (const que in class_name) {
					const [del, ___] = await Classes.findIdByName(class_name[que], tid);

					if (del.length === 0) {
						check = false;
					} else {
						all.push(del[0].class_id);
					}
				}

				if (!check) {
					res.status(400);
					throw new Error("One Or Class Doesn't Exist!");
				} else {
					if (ispaid === "free") {
						if (no_level > 1) {
							res.status(400);
							throw new Error(
								"Organisation not subscribed. Max Level is One Max."
							);
						} else {
							all = JSON.stringify(all);
							const [newQuiz, ____] = await Quizzes.update(
								quiz_id,
								tid,
								newQuizName,
								no_level,
								dur_level,
								subject,
								point,
								pass_mark,
								all,
								JSON.stringify(class_name),
								status,
								quiz_type,
								can_reload,
								JSON.stringify(category)
							);
							await Quizzes.updateName(quiz_id, newQuizName);

							if (newQuiz.affectedRows > 0) {
								res.status(200).json({
									data: [],
									message: "Quiz Data Updated Successfully!",
								});
							} else {
								res.status(400);
								throw new Error("An Error Occured");
							}
						}
					} else {
						all = JSON.stringify(all);
						const [newQuiz, ____] = await Quizzes.update(
							quiz_id,
							tid,
							newQuizName,
							no_level,
							dur_level,
							subject,
							point,
							pass_mark,
							all,
							JSON.stringify(class_name),
							status,
							quiz_type,
							can_reload,
							JSON.stringify(category)
						);
						await Quizzes.updateName(quiz_id, newQuizName);

						if (newQuiz.affectedRows > 0) {
							res.status(200).json({
								data: [],
								message: "Quiz Data Updated Successfully!",
							});
						} else {
							res.status(400);
							throw new Error("An Error Occured");
						}
					}
				}
			}
		} else {
			let check = true;
			let all = [];
			for (const que in class_name) {
				const [del, ___] = await Classes.findIdByName(class_name[que], tid);

				if (del.length === 0) {
					check = false;
				} else {
					all.push(del[0].class_id);
				}
			}

			if (!check) {
				res.status(400);
				throw new Error("One Or Class Doesn't Exist!");
			} else {
				if (ispaid === "free") {
					if (no_level > 1) {
						res.status(400);
						throw new Error(
							"Organisation not subscribed. Max Level is One Max."
						);
					} else {
						all = JSON.stringify(all);
						const [newQuiz, ____] = await Quizzes.update(
							quiz_id,
							tid,
							newQuizName,
							no_level,
							dur_level,
							subject,
							point,
							pass_mark,
							all,
							JSON.stringify(class_name),
							status,
							quiz_type,
							can_reload,
							JSON.stringify(category)
						);
						await Quizzes.updateName(quiz_id, newQuizName);

						if (newQuiz.affectedRows > 0) {
							res.status(200).json({
								data: [],
								message: "Quiz Data Updated Successfully!",
							});
						} else {
							res.status(400);
							throw new Error("An Error Occured");
						}
					}
				} else {
					all = JSON.stringify(all);
					const [newQuiz, ____] = await Quizzes.update(
						quiz_id,
						tid,
						newQuizName,
						no_level,
						dur_level,
						subject,
						point,
						pass_mark,
						all,
						JSON.stringify(class_name),
						status,
						quiz_type,
						can_reload,
						JSON.stringify(category)
					);

					await Quizzes.updateName(quiz_id, newQuizName);

					if (newQuiz.affectedRows > 0) {
						res.status(200).json({
							data: [],
							message: "Quiz Data Updated Successfully!",
						});
					} else {
						res.status(400);
						throw new Error("An Error Occured");
					}
				}
			}
		}
	} else {
		res.status(400);
		throw new Error("Quiz Not Found");
	}
});

const deleteQuiz = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const [del, __] = await Quizzes.findById(tid, req.params.id);
	if (del.length === 0) {
		res.status(400);
		throw new Error("Quiz Doesn't Exist!");
	} else {
		const [quizes, ___] = await Quizzes.delete(tid, req.params.id);

		if (quizes.affectedRows > 0) {
			res.status(200).json({ data: [], message: "Quiz Deleted Successfully!" });
		} else {
			res.status(400);
			throw new Error("Unable To Delete Quiz!");
		}
	}
});

const setQuestion = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const { quiz_id, question, type, level, options, answers, category } =
		req.body;

	if (
		!quiz_id ||
		!question ||
		!type ||
		!level ||
		!options ||
		!answers ||
		!category
	) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}
	const [quizes, ___] = await Quizzes.findById(tid, quiz_id);
	if (quizes.length <= 0) {
		res.status(400);
		throw new Error("No Quiz Found");
	} else {
		if (quizes[0].status === "publish") {
			res.status(400);
			throw new Error("You can't add question to a published quiz");
		}
	}
	let op = options;
	let as = answers;

	const [que, __] = await Quizzes.setQuestion(
		quiz_id,
		question,
		type,
		level,
		op,
		as,
		tid,
		category
	);
	if (que.length > 0) {
		res
			.status(200)
			.json({ data: que, message: "Question Added Successfully!" });
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const setSpellingQuestion = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const { quiz_id, type, level, address, word, hint, category } = req.body;

	if (!quiz_id || !type || !level || !address || !word || !hint || !category) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}
	const [quizes, ___] = await Quizzes.findById(tid, quiz_id);
	if (quizes.length <= 0) {
		res.status(400);
		throw new Error("No Quiz Found");
	} else {
		if (quizes[0].status === "publish") {
			res.status(400);
			throw new Error("You can't add question to a published quiz");
		}
	}

	const [que, __] = await Quizzes.setSpellingQuestion(
		quiz_id,
		type,
		level,
		address,
		word,
		hint,
		tid,
		category
	);
	if (que.length > 0) {
		res
			.status(200)
			.json({ data: que, message: "Question Added Successfully!" });
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const updateQuestion = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const { id, quiz_id, question, type, level, options, answers, category } =
		req.body;

	if (
		!id ||
		!quiz_id ||
		!question ||
		!type ||
		!level ||
		!options ||
		!answers ||
		!category
	) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}
	const [quizes, ___] = await Quizzes.findById(tid, quiz_id);
	if (quizes.length <= 0) {
		res.status(400);
		throw new Error("No Quiz Found");
	} else {
		if (quizes[0].status === "publish") {
			res.status(400);
			throw new Error("You can't edit question of a published quiz");
		}
	}
	let op = options;
	let as = answers;

	const [que, __] = await Quizzes.updateQuestion(
		id,
		quiz_id,
		question,
		type,
		level,
		op,
		as,
		tid,
		category
	);
	if (que.affectedRows > 0) {
		res
			.status(200)
			.json({ data: [], message: "Question Updated Successfully!" });
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const updateSpellingQuestion = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const { id, quiz_id, type, level, address, word, hint, category } = req.body;

	if (
		!id ||
		!quiz_id ||
		!type ||
		!level ||
		!address ||
		!word ||
		!hint ||
		!category
	) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}
	const [quizes, ___] = await Quizzes.findById(tid, quiz_id);
	if (quizes.length <= 0) {
		res.status(400);
		throw new Error("No Quiz Found");
	} else {
		if (quizes[0].status === "publish") {
			res.status(400);
			throw new Error("You can't edit question of a published quiz");
		}
	}

	const [que, __] = await Quizzes.updateSpellingQuestion(
		id,
		quiz_id,
		type,
		level,
		address,
		word,
		hint,
		tid,
		category
	);
	if (que.affectedRows > 0) {
		res
			.status(200)
			.json({ data: [], message: "Question Updated Successfully!" });
	} else {
		res.status(400);
		throw new Error("An Error Occured");
	}
});

const deleteSpellingQuestion = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const { id, quiz_id } = req.params;

	const [quiz, __] = await Quizzes.findById(tid, quiz_id);
	if (quiz.length === 0) {
		res.status(400);
		throw new Error("Quiz Doesn't Exist!");
	} else {
		if (quiz[0].status === "publish") {
			res.status(400);
			throw new Error("Quiz Published. Can't Delete Question!");
		}

		const [que, ___] = await Quizzes.deleteSpellingQuestion(id, quiz_id, tid);
		if (que.affectedRows > 0) {
			res
				.status(200)
				.json({ data: [], message: "Question Deleted Successfully!" });
		} else {
			res.status(400);
			throw new Error("An Error Occured");
		}
	}
});

const deleteQuestion = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const { id, quiz_id } = req.params;
	const [quiz, __] = await Quizzes.findById(tid, quiz_id);

	if (quiz.length === 0) {
		res.status(400);
		throw new Error("Quiz Doesn't Exist!");
	} else {
		if (quiz[0].status === "publish") {
			res.status(400);
			throw new Error("Quiz Published. Can't Delete Question!");
		}

		const [que, ___] = await Quizzes.deleteQuestion(id, quiz_id, tid);
		if (que.affectedRows > 0) {
			res
				.status(200)
				.json({ data: [], message: "Question Deleted Successfully!" });
		} else {
			res.status(400);
			throw new Error("An Error Occured");
		}
	}
});

const getTeacherQuestion = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const { quiz_id } = req.params;

	if (!quiz_id) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const [que, __] = await Quizzes.getQuestion(quiz_id, tid);
	if (que.length > 0) {
		res.status(200).json({ data: que, message: "Questions Found!" });
	} else {
		res.status(400);
		throw new Error("No Question Found!");
	}
});

const getTeacherSpellingQuestion = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;
	const { quiz_id } = req.params;

	if (!quiz_id) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const [que, __] = await Quizzes.getSpellingQuestion(quiz_id, tid);
	if (que.length > 0) {
		res.status(200).json({ data: que, message: "Questions Found!" });
	} else {
		res.status(400);
		throw new Error("No Question Found!");
	}
});

const getAllScore = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	const tid = teacher[0].teacher_id;

	if (tid === null || tid === undefined) {
		res.status(400);
		throw new Error("Teacher Not Found");
	}

	const [que, __] = await Quizzes.findByTeacherId(tid);
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

const getOrgName = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	if (teacher.length === 0) {
		res.status(404);
		throw new Error("Admin Not Found");
	} else {
		const [orgName, __] = await Admin.getOrgName(teacher[0].admin_id);

		res
			.status(200)
			.json({ data: orgName[0], message: "Organization Name Found" });
	}
});

const getStudentInClass = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	if (teacher.length === 0) {
		res.status(404);
		throw new Error("Teacher Not Found");
	}
	const tid = teacher[0].teacher_id;
	const aid = teacher[0].admin_id;
	const { class_name } = req.body;

	if (!class_name) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}
	const [del, __] = await Classes.findIdByName(class_name, tid);
	if (del.length === 0) {
		res.status(400);
		throw new Error("Class Doesn't Exist!");
	} else {
		let class_id = del[0].class_id;
		const [classes, __] = await InStudent.getStudentClasses(aid);
		if (classes.length === 0) {
			res.status(400);
			throw new Error("Class Doesn't Exist!");
		}

		let students = [];
		classes.map((student) => {
			if (
				student.classes !== null &&
				student.classes.indexOf(class_id) !== -1
			) {
				const { password, ...data } = student;
				students.push(data);
			}
		});

		if (students.length === 0) {
			res.status(200).json({ data: [], message: "No Student Found" });
		} else {
			res.status(200).json({ data: students, message: "Students Found" });
		}
	}
});

const removeStudent = asyncHandler(async (req, res, next) => {
	const reqEmail = req.teacher[0][0].email;
	const [teacher, _] = await Teacher.findByEmail(reqEmail);
	if (teacher.length === 0) {
		res.status(404);
		throw new Error("Teacher Not Found");
	}
	const tid = teacher[0].teacher_id;
	const { class_name, student_id } = req.body;
	if (!class_name || !student_id) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}

	const [student, p_] = await InStudent.findById(student_id);
	if (student.length === 0) {
		res.status(400);
		throw new Error("Student Not Found");
	}
	const [del, __] = await Classes.findIdByName(class_name, tid);
	if (del.length === 0) {
		res.status(400);
		throw new Error("Class Doesn't Exist!");
	}
	let class_id = del[0].class_id;

	let class_col = student[0].classes;

	if (
		class_col === "" ||
		class_col === null ||
		class_col.indexOf(class_id) === -1
	) {
		res.status(400);
		throw new Error("No Class Found");
	} else {
		class_col = class_col.replace(`${class_id},`, "");
		class_col = class_col.replace(`,${class_id}`, "");
		class_col = class_col.replace(class_id, "");

		await InStudent.joinClass(student_id, class_col);
		const [student, _] = await InStudent.findById(student_id);
		const id = student[0].student_id;
		class_col = student[0].classes;
		if (class_col === "" || class_col === null) {
			res.status(200).json({
				message: "Successfully Removed Student",
			});
		} else {
			const find = class_col.indexOf(class_id);
			if (find < 0) {
				res.status(200).json({
					message: "Successfully Removed Student",
				});
			}
		}
	}
});

const updateDates = asyncHandler(async (req, res, next) => {
	const { quiz_id, closing, start } = req.body;

	if (!quiz_id || !closing || !start) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}
	const reqEmail = req.teacher[0][0].email;
	const [teacher, __] = await Teacher.findByEmail(reqEmail);
	const aid = teacher[0].admin_id;
	const tid = teacher[0].teacher_id;

	const [quiz, ___] = await Quizzes.findById(tid, quiz_id);
	if (quiz.length === 0) {
		res.status(400);
		throw new Error("Quiz Doesn't Exist");
	}
	if (quiz[0].status === "publish") {
		res.status(400);
		throw new Error("Quiz Already Published");
	}

	const [publish, ____] = await Quizzes.updateDates(
		aid,
		tid,
		quiz_id,
		start,
		closing
	);
	if (publish.affectedRows > 0) {
		res.status(200).json({ message: "Quiz Scheduled Successfully!" });
	} else {
		res.status(400);
		throw new Error("Error Publishing Quiz");
	}
});

module.exports = {
	getQuizData,
	getTeacherData,
	createTeacher,
	getAllQuizes,
	getAllClasses,
	updateTeacher,
	loginTeacher,
	createClass,
	createQuiz,
	deleteQuiz,
	deleteClass,
	updateQuiz,
	updateClass,
	setQuestion,
	deleteQuestion,
	getTeacherQuestion,
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
};
