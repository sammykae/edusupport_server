const { db } = require("../config/db");

class Admin {
	constructor(
		admin_id,
		firstname,
		lastname,
		username,
		gender,
		email,
		phone,
		org_name,
		org_address,
		password
	) {
		this.admin_id = admin_id;
		this.firstname = firstname;
		this.lastname = lastname;
		this.username = username;
		this.gender = gender;
		this.email = email;
		this.phone = phone;
		this.org_name = org_name;
		this.org_address = org_address;
		this.password = password;
	}

	async save() {
		let sql = `insert into admin (admin_id,firstname,lastname,username,gender,email,phone,org_name,org_address,password,date_created) values(
			'${this.admin_id}',
			'${this.firstname}',
			'${this.lastname}',
			'${this.username}',
			'${this.gender}',
			'${this.email}',
			'${this.phone}',
			'${this.org_name}',
			'${this.org_address}',
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
		org_name,
		org_address,
		avatar
	) {
		let sql = `update admin set 
		firstname = '${firstname}',
		lastname = '${lastname}',
		username = '${username}',
		gender = '${gender}',
		email = '${email}',
		phone = '${phone}',
		org_name = '${org_name}',
		org_address = '${org_address}',
		avatar = '${avatar}'
		where admin_id = '${id}'`;

		return db.execute(sql);
	}

	static updatePassword(id, password) {
		let sql = `update admin set 
		password = '${password}'
		where admin_id = '${id}'`;

		return db.execute(sql);
	}
	static createSub(id) {
		const ref = id;
		let sql = `insert into subscription (admin_id,plan,reference,date_sub,date_end) 
		values ('${id}','free','${ref}',now(),adddate(now(),interval 1 month))`;
		return db.execute(sql);
	}

	static async paid(id, plan, ref, newDur) {
		let inv;
		if (newDur === "1month") {
			inv = "1 month";
		} else if (newDur === "3month") {
			inv = "3 month";
		} else if (newDur === "1year") {
			inv = "1 year";
		}
		let sql = `update subscription set 
		plan='${plan}',
		reference='${ref}',
		date_sub=now(),
		date_end=adddate(now(), interval ${inv})
		where admin_id='${id}'
		`;

		const [reply, _] = await db.execute(sql);
		if (reply.affectedRows > 0) {
			const pay = "true";
			let sql = `update admin set paid='${pay}' where admin_id='${id}'`;
			const [reply, _] = await db.execute(sql);
			return reply;
		} else {
			return { affectedRows: 0, message: "Could Not Save Subscription" };
		}
	}

	static async getPaid(id) {
		let sql = `select paid from admin where admin_id='${id}'`;

		const [reply, _] = await db.execute(sql);

		if (reply[0].paid === "false") {
			let sql = `select * from subscription where admin_id='${id}'`;
			const [reply, _] = await db.execute(sql);
			return { ...reply[0], paid: "false" };
		} else {
			let sql = `select * from subscription where admin_id='${id}'`;
			const [reply, _] = await db.execute(sql);
			return { ...reply[0], paid: "true" };
		}
	}

	static findById(id) {
		let sql = `select * from admin where admin_id = '${id}'`;
		return db.execute(sql);
	}

	static findByEmail(email) {
		let sql = `select * from admin where email = '${email}'`;
		return db.execute(sql);
	}
	static getOrgName(id) {
		let sql = `select org_name from admin where admin_id = '${id}'`;
		return db.execute(sql);
	}
}

module.exports = Admin;
