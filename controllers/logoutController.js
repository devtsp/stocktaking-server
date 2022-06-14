const prisma = require('../prisma/prismaClient');

const logoutUser = async (req, res) => {
	const refreshToken = req.cookies?.jwt;

	if (!refreshToken) {
		return res.sendStatus(204);
	}

	try {
		const foundUser = await prisma.refresh_token.findFirst({
			where: { refreshToken },
			include: {
				user: true,
			},
		});

		if (!foundUser) {
			res.clearCookie('jwt', {
				secure: true,
				httpOnly: true,
				sameSite: 'None',
			});

			return res.sendStatus(204);
		}

		res.clearCookie('jwt', {
			secure: true,
			httpOnly: true,
			sameSite: 'None',
		});

		await prisma.refresh_token.delete({ where: { refreshToken } });
		res.sendStatus(204);
	} catch (err) {
		res.status(500).json(err.message);
	}
};

module.exports = logoutUser;
