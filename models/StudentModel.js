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

	static createSub(id) {
		const ref = id;
		let sql = `insert into student_sub (student_id,plan,reference,date_sub,date_end) 
		values ('${id}','free','${ref}',now(),adddate(now(),interval 1 year))`;
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
	static createSub(id) {
		const ref = id;
		let sql = `insert into student_sub (student_id,plan,reference,date_sub,date_end) 
		values ('${id}','free','${ref}',now(),adddate(now(),interval 1 year))`;
		return db.execute(sql);
	}
	static checkSub(id) {
		let sql = `select * from  student_sub where student_id='${id}'`;
		return db.execute(sql);
	}

	static async paid(id, plan, ref, newDur) {
		let inv;
		if (newDur === "6month") {
			inv = "6 month";
		} else if (newDur === "1year") {
			inv = "1 year";
		}
		let sql = `update student_sub set 
		plan='${plan}',
		reference='${ref}',
		date_sub=now(),
		date_end=adddate(now(), interval ${inv})
		where student_id='${id}'
		`;

		const [reply, _] = await db.execute(sql);
		if (reply.affectedRows > 0) {
			const pay = "true";
			let sql = `update students set paid='${pay}' where student_id='${id}'`;
			const [reply, _] = await db.execute(sql);
			return reply;
		} else {
			return { affectedRows: 0, message: "Could Not Save subscription" };
		}
	}

	static async getPaid(id) {
		let sql = `select paid from students where student_id='${id}'`;

		const [reply, _] = await db.execute(sql);

		if (reply[0].paid === "false") {
			let sql = `select * from student_sub where student_id='${id}'`;
			const [reply, _] = await db.execute(sql);
			return { ...reply[0], paid: "false" };
		} else {
			let sql = `select * from student_sub where student_id='${id}'`;
			const [reply, _] = await db.execute(sql);
			return { ...reply[0], paid: "true" };
		}
	}
}

module.exports = { InStudent, GStudent };
