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

	if (!concept.trim()) {
		return res.status(400).json({ error: "'Concept' field is required" });
	}
	if (!amount.trim()) {
		return res.status(400).json({ error: "'Amount' field is required" });
	}
	if (!type.trim()) {
		return res.status(400).json({ error: "'Type' field is required" });
	}

	const id = uuid();
	const createdAt = newDate();

	const connection = await connectDB;
	await connection.execute(
		`INSERT INTO transactions( id, createdAt, concept, amount, type ) VALUES( "${id}", "${createdAt}", "${concept}", ${+amount}, "${type}" )`
	);

	res.json({ id, createdAt, concept, amount: +amount, type });
};

const removeTransaction = async (req, res) => {
	const { id } = req.body;

	if (!id.trim()) {
		return res.status(400).json({ error: 'Id field required' });
	}

	const connection = await connectDB;
	await connection.execute(`DELETE FROM transactions WHERE id = '${id}'`);
	res.json({ message: `Object with id '${id}' deleted succesfully` });
};

const updateTransaction = async (req, res) => {
	const { id, amount, concept } = req.body;

	if (!id.trim()) {
		return res.status(400).json({ error: 'Id field required' });
	}

	const connection = await connectDB;
	const [row, fields] = await connection.execute(
		`SELECT * FROM transactions WHERE id = "${id}"`
	);

	if (!Object.keys(row).length) {
		return res.status(204).json({ error: 'Not found' }).end();
	}

	const validFields = Object.entries({ amount, concept }).filter(
		([key, value]) => !!value
	);

	if (!validFields.length) {
		return res.status(400).json({ error: 'Empty fields' });
	}

	const formattedFields = validFields.map(
		([key, value]) => ` ${key} = "${value}"`
	);

	await connection.execute(
		`UPDATE transactions SET ${formattedFields}, modifiedAt = "${newDate()}" WHERE id = "${id}"`
	);

	res.json({ message: `Object with id '${id}' updated succesfully` });
};

module.exports = {
	getAllTransactions,
	createTransaction,
	removeTransaction,
	updateTransaction,
};
