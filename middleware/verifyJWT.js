const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if (!authHeader?.startsWith('Bearer ')) {
		res.sendStatus(401);
	}

	const token = authHeader.split(' ')[1];
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
		if (error) {
			return res.status(403).json({ error: 'Invalid/expired token' });
		}
		req.user = decoded.UserInfo.user;
		next();
	});
};

module.exports = verifyJWT;
