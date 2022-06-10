const updateRefreshToken = (oldToken, newToken) => {
	return `UPDATE refresh_tokens SET refreshToken = "${newToken}" WHERE refreshToken = "${oldToken}" `;
};

const addRefreshToken = (userId, token) => {
	return `INSERT INTO refresh_tokens(tokenUserId, refreshToken) VALUES("${userId}", "${token}")`;
};

const removeRefreshToken = token => {
	return `DELETE FROM refresh_tokens WHERE refreshToken = "${token}" `;
};

const removeAllUserTokens = userId => {
	return `DELETE FROM refresh_tokens WHERE tokenUserId = "${userId}"`;
};

module.exports = {
	updateRefreshToken,
	removeRefreshToken,
	removeAllUserTokens,
	addRefreshToken,
};
