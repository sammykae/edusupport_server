const { db } = require("../config/db");

class Teacher {
	constructor(
		teacher_id,
		admin_id,
		firstname,
		lastname,
		username,
		gender,
		email,
		phone,
		password
	) {
		this.teacher_id = teacher_id;
		this.admin_id = admin_id;
		this.firstname = firstname;
		this.lastname = lastname;
		this.username = username;
		this.gender = gender;
		this.email = email;
		this.phone = phone;
		this.password = password;
	}

	async save() {
		let sql = `insert into teachers (teacher_id,admin_id,firstname,
			lastname,username,gender,email,phone,password,date_created) values(
			'${this.teacher_id}',
            '${this.admin_id}',
			'${this.firstname}',
			'${this.lastname}',
			'${this.username}',
			'${this.gender}',
			'${this.email}',
			'${this.phone}',
			'${this.password}',
			now()
		)`;
		return db.execute(sql);
	}

	static update(
		id,
		firstname,
		lastname,
		username,
		gender,
		email,
		phone,
		avatar
	) {
		let sql = `update teachers set 
		firstname = '${firstname}',
		lastname = '${lastname}',
		username = '${username}',
		gender = '${gender}',
		email = '${email}',
		phone = '${phone}',
		avatar = '${avatar}'
		where teacher_id = '${id}'`;

		return db.execute(sql);
	}

	static updatePassword(id, password) {
		let sql = `update teachers set 
		password = '${password}'
		where teacher_id = '${id}'`;

		return db.execute(sql);
	}

	static paid(id) {
		let sql = `select plan from subscription where admin_id='${id}'`;

		return db.execute(sql);
	}

	static findByAdminId(id) {
		let sql = `select * from teachers where admin_id = '${id}' order by id desc`;
		return db.execute(sql);
	}

	static findById(id) {
		let sql = `select * from teachers where teacher_id = '${id}'`;
		return db.execute(sql);
	}

	static findByEmail(email) {
		let sql = `select * from teachers where email = '${email}'`;
		return db.execute(sql);
	}

	static delete(admin_id, id) {
		let sql = `delete from teachers where teacher_id='${id}' and admin_id = '${admin_id}'`;

		return db.execute(sql);
	}
}

module.exports = Teacher;
