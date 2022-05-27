const { v4: uuid } = require('uuid');

const connectDB = require('../config/dbConn');
const transactionQueries = require('../sql/transactionQueries');
const newDate = require('../utils/formatDate');

const getAllTransactions = async (req, res) => {
	const connection = await connectDB;
	const [rows] = await connection.execute(transactionQueries.selectAll());
	if (!rows.length) {
		return res.status(204).end();
	}
	res.json(rows);
};

const createTransaction = async (req, res) => {
	const { concept, amount, type } = req.body;
	!concept.trim() &&
		res.status(400).json({ error: "'Concept' field is required" });
	!amount.trim() &&
		res.status(400).json({ error: "'Amount' field is required" });
	!type.trim() && res.status(400).json({ error: "'Type' field is required" });

	const transaction = {
		id: uuid(),
		createdAt: new Date().toISOString(),
		concept,
		amount: +amount,
		type,
	};
	const connection = await connectDB;
	await connection.execute(transactionQueries.insert(transaction));
	res.json(transaction);
};

const removeTransaction = async (req, res) => {
	const { id } = req.body;
	!id.trim() && res.status(400).json({ error: 'Id field required' });

	const connection = await connectDB;
	await connection.execute(transactionQueries.remove(transaction));
	const transaction = { id, deletedAt: new Date().toISOString() };
	res.json({ message: `Object with id '${id}' deleted succesfully` });
};

const updateTransaction = async (req, res) => {
	const { id, amount, concept } = req.body;
	!id.trim() && res.status(400).json({ error: 'Id field required' });

	const connection = await connectDB;
	const [entry] = connection.execute(transactionQueries.select(id));
	!Object.keys(entry).length && res.status(204).end();

	const validFields = Object.entries({ amount, concept }).filter(
		([key, value]) => !!value
	);
	!validFields.length && res.status(400).json({ error: 'Empty fields' });
	let [rows] = await connection.execute(transactionQueries.select(id));
	!Object.keys(rows).length && res.status(204).end();

	await connection.execute(transactionQueries.update(transaction));
	const transaction = { validFields, id, updatedAt: new Date().toISOString() };
	res.json({ message: `Object with id '${id}' updated succesfully` });
};

module.exports = {
	getAllTransactions,
	createTransaction,
	removeTransaction,
	updateTransaction,
};
