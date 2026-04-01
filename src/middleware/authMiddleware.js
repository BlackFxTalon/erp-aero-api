const { verifyAccessToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  // The token comes in the header: "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Split the string "Bearer eyJhbGc..." into ["Bearer", "eyJhbGc..."]
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  const token = parts[1];

  try {
    const payload = verifyAccessToken(token);
    // Place the user data in the request object —
    // now in any subsequent middleware or controller
    // req.user.id is available
    req.user = payload;
    next(); // pass control further
  } catch (error) {
    // jwt.verify throws TokenExpiredError or JsonWebTokenError
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'The token has expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
