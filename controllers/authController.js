const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = require('../prisma/prismaClient');

const logUser = async (req, res) => {
	const cookies = req.cookies;
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json('Email and password are required');
	}

	try {
		const foundUser = await prisma.user.findFirst({ where: { email } });

		if (!foundUser) {
			return res.status(401).json('Email not registered');
		}

		const validPassword = await bcrypt.compare(password, foundUser.password);

		if (validPassword) {
			const accessToken = jwt.sign(
				{ UserInfo: { email: foundUser.email, userId: foundUser.id } },
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '10m' }
			);

			const refreshToken = jwt.sign(
				{ email: foundUser.email, userId: foundUser.id },
				process.env.REFRESH_TOKEN_SECRET,
				{ expiresIn: '24h' }
			);

			if (cookies?.jwt) {
				res.clearCookie('jwt', {
					secure: true,
					httpOnly: true,
					sameSite: 'None',
				});

				const previousToken = cookies.jwt;

				const foundToken = await prisma.refresh_token.findFirst({
					where: { refreshToken: previousToken },
				});

				if (foundToken) {
					await prisma.refresh_token.delete({
						where: { refreshToken: previousToken },
					});
				}
			}

			await prisma.refresh_token.create({
				data: { tokenUserId: foundUser.id, refreshToken },
			});

			res.cookie('jwt', refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'None',
				maxAge: 24 * 60 * 60 * 1000,
			});

			res.json({ accessToken });
		} else {
			res.status(401).json('Invalid password');
		}
	} catch (err) {
		res.status(500).json(err.message);
	}
};

module.exports = logUser;
