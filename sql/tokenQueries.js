const updateRefreshToken = (userId, token) => {
	return `UPDATE refresh_tokens SET tokenUserId = "${userId}", refreshToken = "${token}" WHERE tokenUserId = "${userId}" `;
};

module.exports = { updateRefreshToken };
