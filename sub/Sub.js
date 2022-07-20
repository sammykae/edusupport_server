const { db } = require("../config/db");
class Sub {
	static select() {
		let sql = `select * from  subscription where datediff(date_end,now()) <=0`;
		return db.execute(sql);
	}

	static selectDateDiff() {
		let sql = `select admin_id,plan,date_sub,date_end, datediff(date_end,now()) as expiry from subscription`;
		return db.execute(sql);
	}

	static async update(id) {
		let sql = `UPDATE subscription SET plan='free',date_sub=NOW(),date_end=ADDDATE(NOW() ,INTERVAL 1 YEAR) WHERE admin_id='${id}'`;

		const [reply, _] = await db.execute(sql);
		if (reply.affectedRows > 0) {
			const pay = "false";
			let sql = `update admin set paid='${pay}' where admin_id='${id}'`;
			const [reply, _] = await db.execute(sql);
			return reply;
		} else {
			return { affectedRows: 0, message: "Could Not update Subscription" };
		}
	}

	static publish(quiz_id) {
		let status = "publish";
		let sql = `update quizzes set 
        status='${status}' where quiz_id = '${quiz_id}'`;
		return db.execute(sql);
	}
	static hold(quiz_id) {
		let status = "onhold";
		let sql = `update quizzes set 
        status='${status}' where quiz_id = '${quiz_id}'`;
		return db.execute(sql);
	}

	static selectQuizOnhold() {
		let sql = `select * from  quizzes where publish_date<=now() and status='onhold' and closing_date >now()`;
		return db.execute(sql);
	}

	static selectQuizPublish() {
		let sql = `select * from  quizzes where closing_date<=now() and status='publish'`;
		return db.execute(sql);
	}
}
module.exports = Sub;
