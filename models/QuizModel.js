const { db } = require("../config/db");

class Quizzes {
	static save(
		quiz_id,
		admin_id,
		teacher_id,
		quiz_name,
		no_level,
		dur_level,
		subject,
		point,
		pass_mark,
		class_id,
		class_name,
		quiz_type,
		can_reload,
		category,
		created_by
	) {
		let sql = `insert into quizzes (quiz_id,admin_id,teacher_id,quiz_name,no_level,category,dur_level,subject,point,pass_mark,class_id,class_name,quiz_type,reload,created_by,date_created) values(
			'${quiz_id}',
			'${admin_id}',
			'${teacher_id}',
            '${quiz_name}',
			'${no_level}',
			'${category}',
            '${dur_level}',
            '${subject}',
			'${point}',
			'${pass_mark}',
            '${class_id}',
			'${class_name}',
            '${quiz_type}',
			'${can_reload}',
			'${created_by}',
            now()
		)`;

		return db.execute(sql);
	}

	static update(
		quiz_id,
		teacher_id,
		quiz_name,
		no_level,
		dur_level,
		subject,
		point,
		pass_mark,
		class_id,
		class_name,
		status,
		quiz_type,
		can_reload,
		category
	) {
		let sql;
		if (status === "publish") {
			sql = `update quizzes set 

        quiz_name='${quiz_name}',
        no_level='${no_level}',
		category='${category}',
        dur_level= '${dur_level}',
        subject='${subject}',
        class_id='${class_id}',
		class_name='${class_name}',
        status='${status}',
		point='${point}',
		pass_mark='${pass_mark}',
        quiz_type=  '${quiz_type}',
		reload='${can_reload}',
		publish_date=now(),
		closing_date=ADDDATE(NOW() ,INTERVAL 1 YEAR)
		where teacher_id = '${teacher_id}' and quiz_id = '${quiz_id}'`;
		} else {
			sql = `update quizzes set 

        quiz_name='${quiz_name}',
        no_level='${no_level}',
		category='${category}',
        dur_level= '${dur_level}',
        subject='${subject}',
        class_id='${class_id}',
		class_name='${class_name}',
        status='${status}',
		point='${point}',
		pass_mark='${pass_mark}',
        quiz_type=  '${quiz_type}',
		reload='${can_reload}',
		publish_date=now(),
		closing_date=now()
		where teacher_id = '${teacher_id}' and quiz_id = '${quiz_id}'`;
		}
		return db.execute(sql);
	}

	static publish(admin_id, teacher_id, quiz_id) {
		let status = "publish";
		let sql = `update quizzes set 
        status='${status}',publish_date=now(),
		closing_date=ADDDATE(NOW() ,INTERVAL 1 YEAR) where teacher_id = '${teacher_id}' and quiz_id = '${quiz_id}' and admin_id = '${admin_id}'`;
		return db.execute(sql);
	}

	static async delete(teacher_id, id) {
		let sql = `delete from questions where quiz_id='${id}' and teacher_id = '${teacher_id}'`;
		const [reply, _] = await db.execute(sql);
		if (reply.affectedRows > 0) {
			let sql = `delete from quizzes where quiz_id='${id}' and teacher_id = '${teacher_id}'`;
			return await db.execute(sql);
		} else {
			let sql = `delete from quizzes where quiz_id='${id}' and teacher_id = '${teacher_id}'`;
			return await db.execute(sql);
		}
	}

	static updateDates(admin_id, teacher_id, quiz_id, start, close) {
		let sql = `update quizzes set 
        publish_date='${start}',
		closing_date='${close}' 
		where teacher_id = '${teacher_id}' and quiz_id = '${quiz_id}' and admin_id = '${admin_id}'`;
		return db.execute(sql);
	}

	static findAll() {
		let sql = `select * from quizzes order by id desc`;
		return db.execute(sql);
	}

	static findById(tid, id) {
		let sql = `select * from quizzes where quiz_id='${id}' and teacher_id='${tid}' order by id desc`;
		return db.execute(sql);
	}

	static findByIdStudent(id) {
		let sql = `select * from quizzes where quiz_id='${id}' order by id desc`;
		return db.execute(sql);
	}

	static findByAdminId(id) {
		let sql = `select * from quizzes where admin_id = '${id}' order by id desc`;
		return db.execute(sql);
	}

	static findByTeacherId(id) {
		let sql = `select * from quizzes where teacher_id = '${id}' order by id desc`;
		return db.execute(sql);
	}

	static findQuizName(quiz_name, id) {
		let sql = `select quiz_name from quizzes where quiz_name='${quiz_name}' and admin_id='${id}' `;
		return db.execute(sql);
	}

	static async setQuestion(
		quiz_id,
		question,
		type,
		level,
		options,
		answers,
		teacher_id
	) {
		let sql = `insert into questions (quiz_id,question,type,level,options,answers,teacher_id) values(
			'${quiz_id}','${question}','${type}','${level}','${options}','${answers}','${teacher_id}'
		)`;

		const [reply, _] = await db.execute(sql);
		if (reply.affectedRows > 0) {
			let sql = `select * from questions  where quiz_id='${quiz_id}' and teacher_id = '${teacher_id}'`;
			return await db.execute(sql);
		}
	}

	static async setSpellingQuestion(
		quiz_id,
		type,
		level,
		address,
		word,
		hint,
		teacher_id
	) {
		let sql = `insert into spelling_questions (quiz_id,type,level,address,word,hint,teacher_id) values(
			'${quiz_id}','${type}','${level}','${address}','${word}','${hint}','${teacher_id}'
		)`;

		const [reply, _] = await db.execute(sql);
		if (reply.affectedRows > 0) {
			let sql = `select * from spelling_questions  where quiz_id='${quiz_id}' and teacher_id = '${teacher_id}'`;
			return await db.execute(sql);
		}
	}

	static updateQuestion(
		id,
		quiz_id,
		question,
		type,
		level,
		options,
		answers,
		teacher_id
	) {
		let sql = `update questions set 
		question='${question}',
		type='${type}',
		level='${level}',
		options='${options}',
		answers='${answers}',
		teacher_id='${teacher_id}'
		where id='${id}' and quiz_id='${quiz_id}'`;

		return db.execute(sql);
	}

	static updateSpellingQuestion(
		id,
		quiz_id,
		type,
		level,
		address,
		word,
		hint,
		teacher_id
	) {
		let sql = `update spelling_questions set 
		type='${type}',
		level='${level}',
		address='${address}',
		word='${word}',
		hint='${hint}',
		teacher_id='${teacher_id}'
		where id='${id}' and quiz_id='${quiz_id}'`;

		return db.execute(sql);
	}

	static deleteQuestion(id, quiz_id, teacher_id) {
		let sql = `delete from questions where id='${id}' and quiz_id='${quiz_id}' and teacher_id = '${teacher_id}'`;

		return db.execute(sql);
	}

	static deleteSpellingQuestion(id, quiz_id, teacher_id) {
		let sql = `delete from spelling_questions where id='${id}' and quiz_id='${quiz_id}' and teacher_id = '${teacher_id}'`;

		return db.execute(sql);
	}

	static getQuestion(quiz_id, teacher_id) {
		let sql = `select * from questions  where quiz_id='${quiz_id}' and teacher_id = '${teacher_id}' order by id desc`;
		return db.execute(sql);
	}

	static getQuestionStudent(quiz_id) {
		let sql = `select * from questions  where quiz_id='${quiz_id}'`;
		return db.execute(sql);
	}

	static getSpellingQuestion(quiz_id, teacher_id) {
		let sql = `select * from spelling_questions  where quiz_id='${quiz_id}' and teacher_id = '${teacher_id}' order by id desc`;
		return db.execute(sql);
	}

	static getSpellingQuestionStudent(quiz_id) {
		let sql = `select * from spelling_questions  where quiz_id='${quiz_id}' `;
		return db.execute(sql);
	}

	static async findQuizzesByClass(aid, class_id) {
		let sql = `select * from quizzes where admin_id = '${aid}' order by id desc`;
		const [reply, _] = await db.execute(sql);
		let quizzes = [];
		if (reply.length > 0) {
			reply.map((re) => {
				if (re.class_id.includes(class_id)) {
					quizzes.push(re);
				}
			});

			return [quizzes];
		} else {
			return [];
		}
	}

	static saveResult(
		student_id,
		student_name,
		quiz_id,
		quiz_name,
		point,
		percent,
		right,
		wrong,
		status,
		time_taken
	) {
		let sql = `insert into results (student_id,student_name,quiz_id,quiz_name,point,percent,right_answers,wrong_answers,status,date_taken,time_taken) values(
			'${student_id}',
			'${student_name}',
			'${quiz_id}',
			'${quiz_name}',
			'${point}',
			'${percent}',
			'${right}',
			'${wrong}',
			'${status}',
			now(),
			'${time_taken}'
		)`;
		return db.execute(sql);
	}

	static saveAnswer(quiz_id, student_id, answers) {
		let sql = `insert into answers (quiz_id,student_id,answers) values(
			'${quiz_id}',
			'${student_id}',
			'${answers}'
		)`;
		return db.execute(sql);
	}

	static getResult(student_id, quiz_id) {
		let sql = `select * from results where student_id='${student_id}' and quiz_id='${quiz_id}' order by id desc`;
		return db.execute(sql);
	}

	static getAnswer(student_id, quiz_id) {
		let sql = `select * from answers where student_id='${student_id}' and quiz_id='${quiz_id}'`;
		return db.execute(sql);
	}

	static getAllResult(student_id) {
		let sql = `select * from results where student_id='${student_id}' order by id desc`;
		return db.execute(sql);
	}
	static getAllResultTeacher(quiz_id) {
		let sql = `select * from results where quiz_id='${quiz_id}' order by id desc`;
		return db.execute(sql);
	}
	static async deleteScore(id, sid) {
		let sql = `delete from answers where student_id='${sid}' and quiz_id='${id}'`;

		const [reply, _] = await db.execute(sql);
		if (reply.affectedRows >= 0) {
			let sql = `delete from results where student_id='${sid}' and quiz_id='${id}'`;
			return db.execute(sql);
		} else {
			return db.execute(sql);
		}
	}

	static updateName(quiz_id, name) {
		let sql = `update results set 
        quiz_name='${name}' where quiz_id = '${quiz_id}'`;
		return db.execute(sql);
	}
}

module.exports = Quizzes;
