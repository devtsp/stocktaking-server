const { v4: uuid } = require('uuid');

const prisma = require('../prisma/prismaClient');

const getAllTransactions = async (req, res) => {
	const { userId } = req;

	if (!userId) {
		return res.status(401).json('User not found');
	}

	const { limit } = req.query;

	try {
		const foundTransactions = await prisma.transaction.findMany({
			where: { transactionUserId: userId, deletedAt: null },
			orderBy: [{ createdAt: 'desc' }],
			...(limit && { take: +limit }),
		});

		if (!foundTransactions.length) {
			return res.sendStatus(204);
		}

		res.json(foundTransactions);
	} catch (err) {
		res.status(500).json(err.message);
	}
};

const createTransaction = async (req, res) => {
	const userId = req.userId;

	if (!userId) {
		return res.status(401).json('User not found');
	}

	const { concept, amount, type } = req.body;

	if (!concept) {
		return res.status(400).json("'Concept' field is required");
	}

	if (!amount) {
		return res.status(400).json("'Amount' field is required");
	}

	if (!type) {
		return res.status(400).json("'Type' field is required");
	}

	const transaction = {
		id: uuid(),
		createdAt: new Date().toISOString(),
		concept,
		amount: type === 'IN' ? +amount : -amount,
		type,
		transactionUserId: userId,
	};

	try {
		const result = await prisma.transaction.create({ data: transaction });
		res.status(201).json(result);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const removeTransaction = async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json('Id field required');
	}

	try {
		const result = await prisma.transaction.update({
			data: { deletedAt: new Date().toISOString() },
			where: { id },
		});

		res.json(result);
	} catch (err) {
		res.status(500).json(err.message);
	}
};

const updateTransaction = async (req, res) => {
	let { id, concept, amount } = req.body;

	if (!id) {
		return res.status(400).json('Id field required');
	}

	try {
		const foundTransaction = await prisma.transaction.findUnique({
			where: { id },
		});

		if (!foundTransaction) {
			return res.status(204).end();
		}

		if (!concept && !amount) {
			return res.status(400).json('Empty fields');
		}

		if (amount) {
			amount =
				foundTransaction.type === 'IN' ? +Math.abs(amount) : -Math.abs(amount);
		}

		const result = await prisma.transaction.update({
			data: {
				modifiedAt: new Date().toISOString(),
				amount,
				concept,
			},
			where: { id },
		});

		res.json(result);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const getBalance = async (req, res) => {
	const userId = req.userId;

	if (!userId) {
		return res.status(401).json('User not found');
	}

	try {
		const foundBalance = await prisma.transaction.aggregate({
			_sum: {
				amount: true,
			},
			where: { transactionUserId: userId },
		});

		res.json(foundBalance._sum.amount);
	} catch (err) {
		res.status(500).json(err.message);
	}
};

module.exports = {
	getAllTransactions,
	createTransaction,
	removeTransaction,
	updateTransaction,
	getBalance,
};
