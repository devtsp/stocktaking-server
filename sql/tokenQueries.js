const updateRefreshToken = (userId, token) => {
	return `UPDATE refresh_tokens SET tokenUserId = "${userId}", refreshToken = "${token}" WHERE tokenUserId = "${userId}" `;
};

const removeRefreshToken = token => {
	return `DELETE FROM refresh_tokens WHERE refreshToken = "${token}" `;
};

module.exports = { updateRefreshToken, removeRefreshToken };
