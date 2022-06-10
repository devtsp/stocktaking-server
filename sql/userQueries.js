const select = email => {
	return `SELECT * from users WHERE email = "${email}"`;
};

const insert = (email, hashedPassword, id) => {
	return `INSERT INTO users(email, password, id) VALUES("${email}", "${hashedPassword}", "${id}")`;
};

const updateRefreshToken = (id, refreshToken) => {
	return `UPDATE users SET refreshToken = "${refreshToken}" WHERE id = "${id}"`;
};

const getByRefreshToken = token => {
	return `SELECT u.id, rt.refreshToken FROM users u JOIN refresh_tokens rt ON u.id = rt.tokenUserId WHERE refreshToken = "${token}";`;
};

module.exports = { select, insert, updateRefreshToken, getByRefreshToken };
