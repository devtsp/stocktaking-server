const connectDB = require('../config/dbConn');

const getAllTransactions = async (req, res) => {
	const connection = await connectDB;
	const [rows, fields] = await connection.execute(
		'SELECT * FROM `transactions`'
	);
	res.json(rows);
};

module.exports = { getAllTransactions };
