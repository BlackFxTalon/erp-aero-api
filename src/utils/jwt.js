const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// create access token (10 min life)

function generateAccessToken(userId) {
    return jwt.sign(
        {id: userId }, // payload
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN } //10m
    );
}

// Create a refresh token.
// Use a UUID instead of a JWT — a refresh token is simply a unique string.
// Its validity is checked through the database (is_revoked), not through a signature.
function generateRefreshToken() {
  return uuidv4();
}


// Check the access token and return the payload
function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}


module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken
};