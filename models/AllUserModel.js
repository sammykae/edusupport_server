const { db } = require("../config/db");

class AllUsers {
	static save(id, username, email) {
		let sql = `insert into allusers (user_id,username,email) values(
			'${id}',
			'${username}',
			'${email}'
		)`;

		return db.execute(sql);
	}

	static update(id, username, email) {
		let sql = `update allusers set 
		username = '${username}',
		email = '${email}'
		where user_id = '${id}'`;
		return db.execute(sql);
	}

	static delete(id) {
		let sql = `delete from allusers where user_id='${id}'`;

		return db.execute(sql);
	}
	static findAll() {
		let sql = `select * from allusers`;
		return db.execute(sql);
	}

	static findById(id) {
		let sql = `select * from allusers where user_id = '${id}'`;
		return db.execute(sql);
	}

	static findByUsername(username) {
		let sql = `select * from allusers where username = '${username}'`;
		return db.execute(sql);
	}

	static findByEmail(email) {
		let sql = `select * from allusers where email = '${email}'`;
		return db.execute(sql);
	}
}

module.exports = AllUsers;
