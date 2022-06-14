const PrismaClient = require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();

const logoutUser = async (req, res) => {
	const refreshToken = req.cookies?.jwt;

	if (!refreshToken) {
		return res.sendStatus(204);
	}
	const foundUser = await prisma.refresh_token.findFirst({
		where: { refreshToken },
		include: {
			user: true,
		},
	});

	if (!foundUser) {
		res.clearCookie('jwt', {
			// secure: true,
			httpOnly: true,
			sameSite: 'None',
		});
		prisma.$disconnect();
		return res.sendStatus(204);
	}

	res.clearCookie('jwt', {
		// secure: true,
		httpOnly: true,
		sameSite: 'None',
	});

	await prisma.refresh_token.delete({ where: { refreshToken } });

	prisma.$disconnect();
	res.sendStatus(204);
};

module.exports = logoutUser;
