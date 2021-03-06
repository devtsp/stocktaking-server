const jwt = require('jsonwebtoken');

const prisma = require('../prisma/prismaClient');

const refreshToken = async (req, res) => {
	const refreshToken = req.cookies?.jwt;

	if (!refreshToken) {
		return res.sendStatus(401);
	}

	try {
		const foundUser = await prisma.refresh_token.findFirst({
			where: { refreshToken },
			include: {
				user: true,
			},
		});

		res.clearCookie('jwt', {
			secure: true,
			httpOnly: true,
			sameSite: 'None',
		});

		// token recieved in cookie but not stored => logout all and return (reuse detected)
		if (!foundUser) {
			console.log('not found user');
			jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET,
				async (err, decoded) => {
					!err &&
						(await prisma.refresh_token.deleteMany({
							where: { tokenUserId: decoded.userId },
						}));
				}
			);

			return res.sendStatus(403);
		}

		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async (err, decoded) => {
				if (err) {
					await prisma.refresh_token.delete({ where: { refreshToken } });
				}

				if (err || foundUser.user.id !== decoded.userId) {
					return res.sendStatus(403);
				}

				const accessToken = jwt.sign(
					{
						UserInfo: {
							email: decoded.email,
							userId: decoded.userId,
						},
					},
					process.env.ACCESS_TOKEN_SECRET,
					{ expiresIn: '10m' }
				);

				const newRefreshToken = jwt.sign(
					{ email: decoded.email, userId: decoded.userId },
					process.env.REFRESH_TOKEN_SECRET,
					{ expiresIn: '24h' }
				);

				await prisma.refresh_token.update({
					data: { refreshToken: newRefreshToken },
					where: { refreshToken },
				});

				res.cookie('jwt', newRefreshToken, {
					httpOnly: true,
					secure: true,
					sameSite: 'None',
					maxAge: 24 * 60 * 60 * 1000,
				});

				res.json({ accessToken });
			}
		);
	} catch (err) {
		res.status(500).json(err.message);
	}
};

module.exports = refreshToken;
