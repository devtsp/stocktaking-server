const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');

const queryDB = require('../sql/dbConn');
const userQueries = require('../sql/userQueries');

const registerNewUser = async (req, res) => {
	const { email, password } = req.body;

	if (!email.trim() || !password.trim()) {
		return res.status(400).json('Email and password are required');
	}

	const [[rows], connection] = await queryDB(userQueries.select(email));

	if (rows.length) {
		return res.status(409).json('Email already registered');
	}

	try {
		const id = uuid();
		const hashedPassword = await bcrypt.hash(password, 10);

		await queryDB(userQueries.insert(email, hashedPassword, id), connection);
		res.status(201).json(`User created with email "${email}"`);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

module.exports = registerNewUser;
