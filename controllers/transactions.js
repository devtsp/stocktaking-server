const { v4: uuid } = require('uuid');

const connectDB = require('../config/dbConn');
const transactions = require('../sql/transactions');
const newDate = require('../utils/formatDate');

const getAll = async (req, res) => {
	const connection = await connectDB;
	const [rows] = await connection.execute(transactions.selectAll());
	if (!rows.length) {
		return res.status(204).end();
	}
	res.json(rows);
};

const create = async (req, res) => {
	const { concept, amount, type } = req.body;
	!concept.trim() &&
		res.status(400).json({ error: "'Concept' field is required" });
	!amount.trim() &&
		res.status(400).json({ error: "'Amount' field is required" });
	!type.trim() && res.status(400).json({ error: "'Type' field is required" });
	const transaction = {
		id: uuid(),
		createdAt: newDate(),
		concept,
		amount: +amount,
		type,
	};
	const connection = await connectDB;
	await connection.execute(transactions.insert(transaction));
	res.json(transaction);
};

const remove = async (req, res) => {
	const { id } = req.body;
	!id.trim() && res.status(400).json({ error: 'Id field required' });
	const connection = await connectDB;
	await connection.execute(transactions.remove(id));
	res.json({ message: `Object with id '${id}' deleted succesfully` });
};

const update = async (req, res) => {
	const { id, amount, concept } = req.body;
	!id.trim() && res.status(400).json({ error: 'Id field required' });
	const validFields = Object.entries({ amount, concept }).filter(
		([key, value]) => !!value
	);
	!validFields.length && res.status(400).json({ error: 'Empty fields' });

	const connection = await connectDB;
	const [rows] = await connection.execute(transactions.select(id));
	!Object.keys(rows).length && res.status(204).end();

	const transaction = { validFields, id, updatedAt: newDate() };
	await connection.execute(transactions.update(transaction));
	res.json({ message: `Object with id '${id}' updated succesfully` });
};

module.exports = {
	getAll,
	create,
	remove,
	update,
};
