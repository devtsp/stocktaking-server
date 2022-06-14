const { v4: uuid } = require('uuid');
const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();

const getAllTransactions = async (req, res) => {
	const userId = req.userId;

	if (!userId) {
		return res.status(401).json('User not found');
	}

	const foundTransactions = await prisma.transaction.findMany({
		where: { transactionUserId: userId, deletedAt: null },
		orderBy: [{ createdAt: 'desc' }],
	});

	if (!foundTransactions.length) {
		return res.sendStatus(204);
	}

	prisma.$disconnect();
	res.json(foundTransactions);
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
	} finally {
		prisma.$disconnect();
	}
};

const removeTransaction = async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json('Id field required');
	}

	const result = await prisma.transaction.update({
		data: { deletedAt: new Date().toISOString() },
		where: { id },
	});

	prisma.$disconnect();
	res.json(result);
};

const updateTransaction = async (req, res) => {
	let { id, concept, amount } = req.body;

	if (!id) {
		return res.status(400).json('Id field required');
	}

	const foundTransaction = await prisma.transaction.findUnique({
		where: { id },
	});

	if (!foundTransaction) {
		prisma.$disconnect();
		return res.status(204).end();
	}

	if (!concept && !amount) {
		prisma.$disconnect();
		return res.status(400).json('Empty fields');
	}

	if (amount) {
		amount =
			foundTransaction.type === 'IN' ? +Math.abs(amount) : -Math.abs(amount);
	}

	try {
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
	} finally {
		prisma.$disconnect();
	}
};

const getBalance = async (req, res) => {
	const userId = req.userId;

	if (!userId) {
		return res.status(401).json('User not found');
	}

	const foundBalance = await prisma.transaction.aggregate({
		_sum: {
			amount: true,
		},
		where: { transactionUserId: userId },
	});

	prisma.$disconnect();
	res.json(foundBalance);
};

module.exports = {
	getAllTransactions,
	createTransaction,
	removeTransaction,
	updateTransaction,
	getBalance,
};
