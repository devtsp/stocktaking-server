const mysql = require('mysql2/promise');

const createPool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

const queryDB = async (query, $connection) => {
	const connection = $connection || (await createPool);
	const result = await connection.execute(query);
	return [result, connection];
};

module.exports = queryDB;
