const queryDB = require('../sql/dbConn');
const userQueries = require('../sql/userQueries');
const tokenQueries = require('../sql/tokenQueries');

const logoutUser = async (req, res) => {
	const refreshToken = req.cookies?.jwt;

	if (!refreshToken) {
		return res.sendStatus(204);
	}

	const [[rows], connection] = await queryDB(
		userQueries.getByRefreshToken(refreshToken)
	);

	if (!rows.length) {
		res.clearCookie('jwt', { secure: true, httpOnly: true, sameSite: 'None' });
		return res.sendStatus(204);
	}

	res.clearCookie('jwt', { secure: true, httpOnly: true, sameSite: 'None' });
	await queryDB(tokenQueries.removeRefreshToken(refreshToken), connection);

	res.sendStatus(204);
};

module.exports = logoutUser;
