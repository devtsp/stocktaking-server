const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const queryDB = require('../sql/dbConn');
const userQueries = require('../sql/userQueries');
const tokenQueries = require('../sql/tokenQueries');

const logUser = async (req, res) => {
	const cookies = req.cookies;
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json('Email and password are required');
	}

	const [[rows], connection] = await queryDB(userQueries.select(email));

	if (!Object.keys(rows).length) {
		return res.status(401).json('Email not registered');
	}

	const user = rows[0];
	const validPassword = await bcrypt.compare(password, user.password);
	if (validPassword) {
		const accessToken = jwt.sign(
			{ UserInfo: { email: user.email, userId: user.id } },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '10s' }
		);

		const refreshToken = jwt.sign(
			{ email: user.email, userId: user.id },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '24h' }
		);

		if (cookies?.jwt) {
			res.clearCookie('jwt', {
				secure: true,
				httpOnly: true,
				sameSite: 'None',
			});
			await queryDB(tokenQueries.removeRefreshToken(cookies.jwt));
		}

		try {
			await queryDB(
				tokenQueries.addRefreshToken(user.id, refreshToken),
				connection
			);

			res.cookie('jwt', refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'None',
				maxAge: 24 * 60 * 60 * 1000,
			});

			res.json({ accessToken });
		} catch (error) {
			res.status(500).json(error.message);
		}
	} else {
		res.status(401).json('Invalid password');
	}
};

module.exports = logUser;
