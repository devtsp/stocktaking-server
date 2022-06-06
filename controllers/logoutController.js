const queryDB = require('../sql/dbConn');
const userQueries = require('../sql/userQueries');

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

	const user = rows[0];
	await queryDB(userQueries.updateRefreshToken(user.id, ''), connection);

	res.clearCookie('jwt', { secure: true, httpOnly: true, sameSite: 'None' });
	res.sendStatus(204);
};

module.exports = logoutUser;
