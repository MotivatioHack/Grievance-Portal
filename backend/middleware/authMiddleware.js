const jwt = require('jsonwebtoken');

// This middleware is for optional authentication (e.g., complaint submission)
exports.optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role };
    } catch (err) {
      console.warn("Invalid token, proceeding as anonymous.");
    }
  }
  next();
};

// --- THIS FUNCTION WAS MISSING ---
// This middleware is for strict admin-only access. It will block non-admin users.
exports.adminOnly = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if the user's role is 'admin'
      if (decoded.role === 'admin') {
        req.user = { id: decoded.id, role: decoded.role };
        next(); // User is an admin, so we proceed.
      } else {
        // The user is logged in but is not an admin. Access denied.
        return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
      }
    } catch (err) {
      // The token is invalid or expired.
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
  } else {
    // No token was provided in the request.
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }
};