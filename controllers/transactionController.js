const { v4: uuid } = require('uuid');

const connectDB = require('../config/dbConn');
const newDate = require('../utils/formatDate');

const getAllTransactions = async (req, res) => {
	const connection = await connectDB;
	const [rows, fields] = await connection.execute('SELECT * FROM transactions');
	res.json(rows);
};

const createTransaction = async (req, res) => {
	const { concept, amount, type } = req.body;
	if (!concept.trim())
		return res.status(400).json({ error: '"Concept" field is required' });
	if (!amount.trim())
		return res.status(400).json({ error: '"Amount" field is required' });
	if (!type.trim())
		return res.status(400).json({ error: '"Type" field is required' });
	const connection = await connectDB;
	const id = uuid();
	const createdAt = newDate();
	await connection.execute(
		`INSERT INTO transactions(id,createdAt,concept,amount,type) 
    VALUES('${id}','${createdAt}','${concept}',${+amount},'${type}')`
	);
	res.send({ id, createdAt, concept, amount: +amount, type });
};

module.exports = { getAllTransactions, createTransaction };
