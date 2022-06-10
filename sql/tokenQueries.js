const updateRefreshToken = (userId, token) => {
	return `UPDATE refresh_tokens SET tokenUserId = "${userId}", refreshToken = "${token}" WHERE tokenUserId = "${userId}" `;
};

const getByRefreshToken = refreshToken => {
	return `SELECT * from users WHERE refreshToken = "${refreshToken}"`;
};

module.exports = { updateRefreshToken, getByRefreshToken };
