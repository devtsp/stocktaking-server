const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');

const queryDB = require('../sql/dbConn');
const userQueries = require('../sql/userQueries');

const registerNewUser = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password are required' });
	}

	const [[rows], connection] = await queryDB(userQueries.select(email));
	if (rows.length) {
		return res.status(409).json({ error: 'Email already registered' });
	}

	try {
		const id = uuid();
		const hashedPassword = await bcrypt.hash(password, 10);
		await queryDB(userQueries.insert(email, hashedPassword, id), connection);
		res.status(201).json({ message: `User created with email "${email}"` });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { registerNewUser };
