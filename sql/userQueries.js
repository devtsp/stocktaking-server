const select = email => `SELECT * from users WHERE email = '${email}'`;

const insert = (email, hashedPassword, id) =>
	`INSERT INTO users(email, password, id) VALUES('${email}', '${hashedPassword}', '${id}')`;

const updateRefreshToken = (id, refreshToken) =>
	`UPDATE users SET refreshToken = '${refreshToken}' WHERE id = '${id}'`;

const getByRefreshToken = refreshToken =>
	`SELECT * from users WHERE refreshToken = '${refreshToken}'`;

module.exports = { select, insert, updateRefreshToken, getByRefreshToken };
