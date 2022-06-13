const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();

const registerNewUser = async (req, res) => {
	const { email, password } = req.body;

	if (!email.trim() || !password.trim()) {
		return res.status(400).json('Email and password are required');
	}

	const foundUser = await prisma.user.findFirst({ where: { email } });

	if (foundUser) {
		return res.status(409).json('Email already registered');
	}

	try {
		const id = uuid();
		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await prisma.user.create({
			data: { email, password: hashedPassword, id },
		});

		res.status(201).json(newUser);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

module.exports = registerNewUser;
