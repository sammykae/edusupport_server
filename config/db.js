// require("dotenv").config();
const mysql = require("mysql2"); // still supporting incase of rollback, and not to break the app;

// CONNECTION APARAMETERS
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const port = process.env.DB_PORT;

const pool = mysql.createPool({
	host, //: process.env.DB_HOST,
	user, //: process.env.DB_USER,
	password, //: process.env.DB_PASSWORD,
	database, //: process.env.DB_NAME,
	port,
});
const db = pool.promise();

module.exports = {
	db,
};
