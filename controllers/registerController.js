const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');

const queryDB = require('../sql/dbConn');
const userQueries = require('../sql/userQueries');

const registerNewUser = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res
			.status(400)
			.json({ error: 'Username and password are required' });
	}

	const [[rows], connection] = await queryDB(userQueries.select(username));
	if (rows.length) {
		return res.status(409).json({ error: 'Username already taken' });
	}

	try {
		const id = uuid();
		const hashedPassword = await bcrypt.hash(password, 10);
		await queryDB(userQueries.insert(username, hashedPassword, id), connection);
		res.status(201).json({ message: `New user "${username}" created` });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { registerNewUser };
