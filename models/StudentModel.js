const { db } = require("../config/db");

class InStudent {
	constructor(
		student_id,
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
		parent_email
	) {
		this.student_id = student_id;
		this.admin_id = admin_id;
		this.firstname = firstname;
		this.lastname = lastname;
		this.username = username;
		this.gender = gender;
		this.email = email;
		this.phone = phone;
		this.dob = dob;
		this.student_type = student_type;
		this.password = password;
		this.parent_email = parent_email;
	}

	async save() {
		let sql = `insert into students 
        (student_id,admin_id,firstname,
			lastname,username,
            gender,email,phone,dob,student_type,password,
            date_created,parent_email) 
            values(
			'${this.student_id}',
            '${this.admin_id}',
			'${this.firstname}',
			'${this.lastname}',
			'${this.username}',
			'${this.gender}',
			'${this.email}',
			'${this.phone}',
			'${this.dob}',
            '${this.student_type}',
			'${this.password}',
            now(), 
            '${this.parent_email}'
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
		dob,
		student_type,
		parent_email,
		avatar
	) {
		let sql = `update students set 
		firstname = '${firstname}',
		lastname = '${lastname}',
		username = '${username}',
		gender = '${gender}',
		email = '${email}',
		phone = '${phone}',
		dob = '${dob}',
        student_type='${student_type}',
        parent_email='${parent_email}',
		avatar = '${avatar}'
		where student_id = '${id}'`;

		return db.execute(sql);
	}

	static updatePassword(id, password) {
		let sql = `update students set 
		password = '${password}'
		where student_id = '${id}'`;

		return db.execute(sql);
	}

	static findByAdminId(id) {
		let sql = `select * from students where admin_id = '${id}' order by id desc`;
		return db.execute(sql);
	}
	static paid(id) {
		let sql = `select plan from subscription where admin_id='${id}'`;

		return db.execute(sql);
	}
	static findById(id) {
		let sql = `select * from students where student_id = '${id}'`;
		return db.execute(sql);
	}

	static findByEmail(email) {
		let sql = `select * from students where email = '${email}'`;
		return db.execute(sql);
	}

	static findByParentEmail(email) {
		let sql = `select * from students where parent_email = '${email}' order by id desc`;
		return db.execute(sql);
	}
	static delete(admin_id, id) {
		let sql = `delete from students where student_id='${id}' and admin_id = '${admin_id}'`;

		return db.execute(sql);
	}
	static joinClass(student_id, classes) {
		let sql = `update students set 
        classes='${classes}' where student_id = '${student_id}'`;
		return db.execute(sql);
	}

	static getStudentClasses(id) {
		let sql = `select * from students where admin_id = '${id}'`;
		return db.execute(sql);
	}
}

class GStudent {
	constructor(
		student_id,
		firstname,
		lastname,
		username,
		gender,
		email,
		phone,
		dob,
		student_type,
		password,
		parent_email
	) {
		this.student_id = student_id;
		this.firstname = firstname;
		this.lastname = lastname;
		this.username = username;
		this.gender = gender;
		this.email = email;
		this.phone = phone;
		this.dob = dob;
		this.student_type = student_type;
		this.password = password;
		this.parent_email = parent_email;
	}

	async save() {
		let sql = `insert into students 
        (student_id,firstname,
			lastname,username,
            gender,email,phone,dob,student_type,password,
            date_created,parent_email) 
            values(
			'${this.student_id}',
			'${this.firstname}',
			'${this.lastname}',
			'${this.username}',
			'${this.gender}',
			'${this.email}',
			'${this.phone}',
			'${this.dob}',
            '${this.student_type}',
			'${this.password}',
            now(), 
            '${this.parent_email}'
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
		dob,
		student_type,
		parent_email,
		avatar
	) {
		let sql = `update students set 
		firstname = '${firstname}',
		lastname = '${lastname}',
		username = '${username}',
		gender = '${gender}',
		email = '${email}',
		phone = '${phone}',
		dob = '${dob}',
        student_type='${student_type}',
        parent_email='${parent_email}',
		avatar = '${avatar}'
		where student_id = '${id}'`;

		return db.execute(sql);
	}
	static updatePassword(id, password) {
		let sql = `update students set 
		password = '${password}'
		where student_id = '${id}'`;

		return db.execute(sql);
	}
	static findById(id) {
		let sql = `select * from students where student_id = '${id}'`;
		return db.execute(sql);
	}

	static findByEmail(email) {
		let sql = `select * from students where email = '${email}'`;
		return db.execute(sql);
	}
	static delete(admin_id, id) {
		let sql = `delete from students where student_id='${id}' and admin_id = '${admin_id}'`;
		return db.execute(sql);
	}
}

module.exports = { InStudent, GStudent };
