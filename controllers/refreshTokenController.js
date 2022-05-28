const jwt = require('jsonwebtoken');

const queryDB = require('../sql/dbConn');
const userQueries = require('../sql/userQueries');

const refreshToken = async (req, res) => {
	const refreshToken = req.cookies?.jwt;
	if (!refreshToken) {
		return res.sendStatus(401);
	}

	const [[rows], connection] = await queryDB(
		userQueries.getByRefreshToken(refreshToken)
	);
	if (!rows.length) {
		return res.sendStatus(403);
	}

	const foundUser = rows[0];

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err || foundUser.email !== decoded.user) {
			return res.sendStatus(403);
		}

		const accessToken = jwt.sign(
			{
				UserInfo: {
					user: decoded.email,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15s' }
		);
		res.json({ accessToken });
	});
};

module.exports = refreshToken;
