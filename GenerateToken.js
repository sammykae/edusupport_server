const jwt = require("jsonwebtoken");
require("dotenv").config();
const generateToken = (email) => {
	return jwt.sign({ email }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});
};

module.exports = generateToken;
