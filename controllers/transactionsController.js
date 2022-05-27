const { v4: uuid } = require('uuid');

const queryDB = require('../sql/dbConn');
const transactionQueries = require('../sql/transactionQueries');

const getAllTransactions = async (req, res) => {
	const [[rows]] = await queryDB(transactionQueries.selectAll());
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
	await queryDB(transactionQueries.insert(transaction));
	res.json(transaction);
};

const removeTransaction = async (req, res) => {
	const { id } = req.body;
	!id.trim() && res.status(400).json({ error: 'Id field required' });
	const transaction = { id, deletedAt: new Date().toISOString() };
	await queryDB(transactionQueries.remove(transaction));
	res.json({ message: `Object with id '${id}' deleted succesfully` });
};

const updateTransaction = async (req, res) => {
	const { id, amount, concept } = req.body;
	!id.trim() && res.status(400).json({ error: 'Id field required' });

	const [[result], connection] = await queryDB(transactionQueries.select(id));
	!Object.keys(result).length && res.status(204).end();

	const validFields = Object.entries({ amount, concept }).filter(
		([key, value]) => !!value
	);
	!validFields.length && res.status(400).json({ error: 'Empty fields' });

	const transaction = { validFields, id, updatedAt: new Date().toISOString() };
	await queryDB(transactionQueries.update(transaction), connection);
	res.json({ message: `Object with id '${id}' updated succesfully` });
};

module.exports = {
	getAllTransactions,
	createTransaction,
	removeTransaction,
	updateTransaction,
};
