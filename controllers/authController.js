const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const queryDB = require('../sql/dbConn');
const userQueries = require('../sql/userQueries');

const logUser = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password are required' });
	}

	const [[[user]]] = await queryDB(userQueries.select(email));

	if (!Object.keys(user).length) {
		return res.status(401).json({ error: 'Email not registered' });
	}

	const validPassword = await bcrypt.compare(password, user.password);
	if (validPassword) {
		const accessToken = jwt.sign(
			{ UserInfo: { user: user.email } },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);
		res.json({ message: `User '${user.email}' logged in`, accessToken });
	} else {
		res.status(401).json({ error: 'Invalid password' });
	}
};

module.exports = { logUser };
