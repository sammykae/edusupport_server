const asyncHandler = require("express-async-handler");
const Quizzes = require("../models/QuizModel");
const home = asyncHandler(async (req, res) => {
	res.status(200).send("Connected To Server!!!");
});

const viewAnswers = asyncHandler(async (req, res, next) => {
	const { id, sid } = req.params;
	if (!id || !sid) {
		res.status(400);
		throw new Error("One or more field empty. Try Again");
	}
	const [answer, __] = await Quizzes.getResult(sid, id);
	if (answer.length > 0) {
		let ans = answer[0]?.answers;
		console.log(answer);
		let result = [];
		const [quiz, __] = await Quizzes.findByIdStudent(id);

		if (quiz.length > 0) {
			const category = quiz[0].category;
			if (quiz[0].quiz_type === "spelling") {
				let [que, _] = await Quizzes.getSpellingQuestionStudent(id);

				if (ans?.length > 0) {
					ans?.map((e) => {
						que?.map((d) => {
							if (e.id === d.id) {
								if (e.word.toLowerCase() === d.word.toLowerCase()) {
									result.push({
										question: d.word,
										category: d.category,
										type: d.type,
										correct_ans: d.word,
										student_ans: e.word,
										correct: true,
									});
								} else {
									result.push({
										question: d.word,
										category: d.category,
										type: d.type,
										correct_ans: d.word,
										student_ans: e.word,
										correct: false,
									});
								}
							}
						});
					});
					que?.map((d) => {
						let temp = ans?.find((element) => element.id === d.id);
						if (!temp) {
							result.push({
								question: d.word,
								category: d.category,
								type: d.type,
								correct_ans: d.word,
								student_ans: "",
								correct: false,
							});
						}
					});
				} else {
					que?.map((d) => {
						result.push({
							question: d.word,
							category: d.category,
							type: d.type,
							correct_ans: d.word,
							student_ans: "",
							correct: false,
						});
					});
				}

				if (result.length > 0) {
					res.status(200).json({
						data: result,
						quiz_type: quiz[0].quiz_type,
						category: category,
						message: "Answers Found",
					});
				} else {
					res.status(400);
					throw new Error("No Result Found!!");
				}
			} else {
				let [que, _] = await Quizzes.getQuestionStudent(id);
				if (ans?.length > 0 && que?.length > 0) {
					ans?.map((e) => {
						que?.map((d) => {
							if (d.id === e.id) {
								if (d.type === "mc") {
									let check = true;
									if (d.answers.length === e.options.length) {
										d.answers.map((f) => {
											if (!e.options.includes(f)) {
												check = false;
											}
										});
										if (check) {
											result.push({
												question: d.question,
												category: d.category,
												type: d.type,
												correct_ans: d.answers,
												student_ans: e.options,
												correct: true,
											});
										} else {
											result.push({
												question: d.question,
												category: d.category,
												type: d.type,
												correct_ans: d.answers,
												student_ans: e.options,
												correct: false,
											});
										}
									}
								} else if (d.type === "fg") {
									let new_options = e.options.map((n) => {
										return n.toLowerCase();
									});
									let new_answers = d.answers.map((n) => {
										return n.toLowerCase();
									});

									let check = true;
									if (d.answers.length === e.options.length) {
										for (let index = 0; index < new_options.length; index++) {
											const element = new_options[index];
											if (new_answers[index] !== element) {
												check = false;
											}
										}
										if (check) {
											result.push({
												question: d.question,
												category: d.category,
												type: d.type,
												correct_ans: d.answers,
												student_ans: e.options,
												correct: true,
											});
										} else {
											result.push({
												question: d.question,
												category: d.category,
												type: d.type,
												correct_ans: d.answers,
												student_ans: e.options,
												correct: false,
											});
										}
									} else {
										result.push({
											question: d.question,
											category: d.category,
											type: d.type,
											correct_ans: d.answers,
											student_ans: e.options,
											correct: false,
										});
									}
								} else if (d.type === "match") {
									if (d?.answers?.length === e?.options?.length) {
										let check = true;
										for (let index = 0; index < d?.answers?.length; index++) {
											if (
												d?.answers[index]?.match !== e?.options[index]?.match
											) {
												check = false;
											}
										}

										if (check) {
											result.push({
												question: d.question,
												category: d.category,
												type: d.type,
												correct_ans: d.answers,
												student_ans: e.options,
												correct: true,
											});
										} else {
											result.push({
												question: d.question,
												category: d.category,
												type: d.type,
												correct_ans: d.answers,
												student_ans: e.options,
												correct: false,
											});
										}
									}
								} else {
									if (e.options === d.answers[0]) {
										result.push({
											question: d.question,
											category: d.category,
											type: d.type,
											correct_ans: d.answers,
											student_ans: e.options,
											correct: true,
										});
									} else {
										result.push({
											question: d.question,
											category: d.category,
											type: d.type,
											correct_ans: d.answers,
											student_ans: e.options,
											correct: false,
										});
									}
								}
							}
						});
					});
					que?.map((d) => {
						let temp = ans.find((element) => element.id === d.id);
						if (!temp) {
							result.push({
								question: d.question,
								category: d.category,
								type: d.type,
								correct_ans: d.answers,
								student_ans: [],
								correct: false,
							});
						}
					});
				} else {
					que?.map((d) => {
						result.push({
							question: d.question,
							category: d.category,
							type: d.type,
							correct_ans: d.answers,
							student_ans: [],
							correct: false,
						});
					});
				}
				if (result.length > 0) {
					res.status(200).json({
						data: result,
						quiz_type: quiz[0].quiz_type,
						category: category,
						message: "Answers Found",
					});
				} else {
					res.status(400);
					throw new Error("No Result Found");
				}
			}
		} else {
			res.status(400);
			throw new Error("Quiz Not Found");
		}
	} else {
		res.status(400);
		throw new Error("No Answers Found");
	}
});
module.exports = {
	home,
	viewAnswers,
};
