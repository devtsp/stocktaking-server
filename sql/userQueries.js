const select = username => `SELECT * from users WHERE username = '${username}'`;

const insert = (username, hashedPassword, id) =>
	`INSERT INTO users(username, password, id) VALUES('${username}', '${hashedPassword}', '${id}')`;

module.exports = { select, insert };
