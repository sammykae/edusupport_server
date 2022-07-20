const { db } = require("../config/db");

class Classes {
	static save(
		class_id,
		admin_id,
		teacher_id,
		class_name,
		status,
		subject,
		created_by
	) {
		let sql = `insert into classes (class_id,admin_id,teacher_id,class_name,status,subject,created_by,date_created) values(
			'${class_id}',
			'${admin_id}',
			'${teacher_id}',
            '${class_name}',
			'${status}',
            '${subject}',
			'${created_by}',
            now()
		)`;

		return db.execute(sql);
	}

	static update(class_id, teacher_id, class_name, status, subject) {
		let sql = `update classes set 
		class_name = '${class_name}',
		status = '${status}',
        subject = '${subject}'
		where teacher_id = '${teacher_id}' and class_id = '${class_id}'`;
		return db.execute(sql);
	}

	static delete(teacher_id, id) {
		let sql = `delete from classes where class_id='${id}' and teacher_id = '${teacher_id}'`;

		return db.execute(sql);
	}

	static findById(id) {
		let sql = `select * from classes where class_id='${id}' `;
		return db.execute(sql);
	}

	static findClassName(class_name, id) {
		let sql = `select class_name from classes where class_name='${class_name}' and admin_id='${id}' `;
		return db.execute(sql);
	}

	static findByClassName(id) {
		let sql = `select class_name from classes where teacher_id='${id}' `;
		return db.execute(sql);
	}
	static findIdByName(name, id) {
		let sql = `select class_id from classes where class_name='${name}' and teacher_id='${id}' `;
		return db.execute(sql);
	}

	static findByAdminId(id) {
		let sql = `select * from classes where admin_id = '${id}' order by id desc`;
		return db.execute(sql);
	}

	static findByTeacherId(id) {
		let sql = `select * from classes where teacher_id = '${id}' order by id desc`;
		return db.execute(sql);
	}
}

module.exports = Classes;
