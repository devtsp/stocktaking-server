const select = email => {
	return `SELECT * from users WHERE email = "${email}"`;
};

const insert = (email, hashedPassword, id) => {
	return `INSERT INTO users(email, password, id) VALUES("${email}", "${hashedPassword}", "${id}")`;
};

const updateRefreshToken = (id, refreshToken) => {
	return `UPDATE users SET refreshToken = "${refreshToken}" WHERE id = "${id}"`;
};

module.exports = { select, insert, updateRefreshToken };
