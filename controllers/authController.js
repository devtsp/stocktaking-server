const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const queryDB = require('../sql/dbConn');
const userQueries = require('../sql/userQueries');

const logUser = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password are required' });
	}

	const [[rows], connection] = await queryDB(userQueries.select(email));

	if (!Object.keys(rows).length) {
		return res.status(401).json({ error: 'Email not registered' });
	}

	const user = rows[0];
	const validPassword = await bcrypt.compare(password, user.password);
	if (validPassword) {
		const accessToken = jwt.sign(
			{ UserInfo: { user: email } },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15s' }
		);
		const refreshToken = jwt.sign(
			{ user: email },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '24h' }
		);

		try {
			await queryDB(userQueries.updateRefreshToken(user.id, refreshToken));
			res.cookie('jwt', refreshToken, {
				httpOnly: true,
				// secure: true,
				sameSite: 'None',
				maxAge: 24 * 60 * 60 * 1000,
			});
			res.json({ accessToken });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	} else {
		res.status(401).json({ error: 'Invalid password' });
	}
};

module.exports = logUser;
