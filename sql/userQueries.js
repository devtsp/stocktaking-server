const select = username => `SELECT * from users WHERE username = '${username}'`;

const insert = (email, hashedPassword, id) =>
	`INSERT INTO users(email, password, id) VALUES('${email}', '${hashedPassword}', '${id}')`;

module.exports = { select, insert };
