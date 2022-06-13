const jwt = require('jsonwebtoken');

const queryDB = require('../sql/dbConn');
const userQueries = require('../sql/userQueries');
const tokenQueries = require('../sql/tokenQueries');

const refreshToken = async (req, res) => {
	const refreshToken = req.cookies?.jwt;

	if (!refreshToken) {
		return res.sendStatus(401);
	}

	const [[rows], connection] = await queryDB(
		userQueries.getByRefreshToken(refreshToken)
	);

	res.clearCookie('jwt', { secure: true, httpOnly: true, sameSite: 'None' });

	// token recieved in cookie but not stored => logout all and return (reuse detected)
	if (!rows.length) {
		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async (err, decoded) => {
				!err && queryDB(tokenQueries.removeAllUserTokens(decoded.userId));
			}
		);
		return res.sendStatus(403);
	}

	const foundUser = rows[0];

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, decoded) => {
			if (err) {
				await queryDB(tokenQueries.removeRefreshToken(refreshToken));
			}
			if (err || foundUser.id !== decoded.userId) {
				return res.sendStatus(403);
			}
			const accessToken = jwt.sign(
				{
					UserInfo: {
						email: decoded.email,
						userId: decoded.userId,
					},
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '10s' }
			);

			const newRefreshToken = jwt.sign(
				{ email: decoded.email, userId: decoded.userId },
				process.env.REFRESH_TOKEN_SECRET,
				{ expiresIn: '24h' }
			);

			await queryDB(
				tokenQueries.updateRefreshToken(refreshToken, newRefreshToken)
			);

			res.cookie('jwt', newRefreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'None',
				maxAge: 24 * 60 * 60 * 1000,
			});

			res.json({ accessToken });
		}
	);
};

module.exports = refreshToken;
