const jwt = require('jsonwebtoken');

function extractTokenFromHeader(authorizationHeader) {
	if (!authorizationHeader) return null;
	const parts = authorizationHeader.split(' ');
	if (parts.length !== 2) return null;
	const [scheme, token] = parts;
	if (!/^Bearer$/i.test(scheme)) return null;
	return token;
}

exports.auth = (req, res, next) => {
	try {
		const token = extractTokenFromHeader(req.headers.authorization);
		if (!token) return res.status(401).json({ message: 'Authorization token missing' });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { id: decoded.id, role: decoded.role };
		return next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};

exports.requireAdmin = (req, res, next) => {
	if (!req.user || req.user.role !== 'admin') {
		return res.status(403).json({ message: 'Admin access required' });
	}
	return next();
};

