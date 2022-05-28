const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if (!authHeader?.startsWith('Bearer ')) {
		return res
			.status(401)
			.json({ error: "Auth header must be =  'Bearer: <token>'" });
	}

	const token = authHeader.split(' ')[1];
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
		if (error) {
			return res.status(403).json({ error: 'Invalid/expired token' });
		}
		req.user = decoded.UserInfo.username;
		next();
	});
};

module.exports = verifyJWT;
