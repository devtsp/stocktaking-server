const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const queryDB = require('../sql/dbConn');
const userQueries = require('../sql/userQueries');

const logUser = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res
			.status(400)
			.json({ error: 'Username and password are required' });
	}

	const [[[user]]] = await queryDB(userQueries.select(username));

	if (!Object.keys(user).length) {
		return res.status(401).json({ error: 'Username does not exists' });
	}

	const validPassword = await bcrypt.compare(password, user.password);
	if (validPassword) {
		const accessToken = jwt.sign(
			{ UserInfo: { username: user.username } },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);
		res.json({ message: `User '${user.username}' logged in`, accessToken });
	} else {
		res.status(401).json({ error: 'Invalid password' });
	}
};

module.exports = { logUser };
