const { v4: uuid } = require('uuid');

const queryDB = require('../sql/dbConn');
const transactionQueries = require('../sql/transactionQueries');

const getAllTransactions = async (req, res) => {
	const user = req.user;
	if (!user) {
		return res.status(401).json({ error: 'Not user found' });
	}

	const [[rows]] = await queryDB(
		transactionQueries.selectAll(user, req?.limit || null)
	);
	if (!rows.length) {
		return res.status(204).end();
	}
	res.json(rows);
};

const createTransaction = async (req, res) => {
	const user = req.user;
	if (!user) {
		return res.status(401).json({ error: 'Not user found' });
	}

	const { concept, amount, type } = req.body;
	if (!concept) {
		return res.status(400).json({ error: "'Concept' field is required" });
	}
	if (!amount) {
		return res.status(400).json({ error: "'Amount' field is required" });
	}
	if (!type) {
		return res.status(400).json({ error: "'Type' field is required" });
	}

	const transaction = {
		id: uuid(),
		createdAt: new Date().toISOString(),
		concept,
		amount: type === 'IN' ? +amount : -amount,
		type,
		user,
	};
	try {
		await queryDB(transactionQueries.insert(transaction));
		res.status(201).json(transaction);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const removeTransaction = async (req, res) => {
	const { id } = req.body;
	if (!id) {
		return res.status(400).json({ error: 'Id field required' });
	}
	const transaction = { id, deletedAt: new Date().toISOString() };
	const [[rows], connection] = await queryDB(
		transactionQueries.remove(transaction)
	);
	if (!rows.length) {
		return res.status(204).end();
	}
	res.json({ message: `Object with id '${id}' deleted succesfully` });
};

const updateTransaction = async (req, res) => {
	const { id, amount, concept } = req.body;
	if (!id) {
		return res.status(400).json({ error: 'Id field required' });
	}

	const [[result], connection] = await queryDB(transactionQueries.select(id));
	if (!Object.keys(result).length) {
		return res.status(204).end();
	}

	const validFields = Object.entries({ amount, concept }).filter(
		([key, value]) => !!value
	);
	if (!validFields.length) {
		return res.status(400).json({ error: 'Empty fields' });
	}

	console.log(validFields);
	const transaction = {
		...Object.fromEntries(validFields),
		id,
		updatedAt: new Date().toISOString(),
		type: result[0].type,
		amount: result[0].type === 'IN' ? +Math.abs(amount) : -Math.abs(amount),
	};

	console.log(transaction);
	try {
		await queryDB(transactionQueries.update(transaction), connection);
		res.json({ message: `Object with id '${id}' updated succesfully` });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getBalance = async (req, res) => {
	const user = req.user;
	if (!user) {
		return res.status(401).json({ error: 'Not user found' });
	}
	const [[balance]] = await queryDB(transactionQueries.getBalance(user));
	res.json(...balance);
};

module.exports = {
	getAllTransactions,
	createTransaction,
	removeTransaction,
	updateTransaction,
	getBalance,
};
