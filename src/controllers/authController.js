const { createUser, findUserById, verifyPassword } = require('../models/userModel');
const { saveRefreshToken, findRefreshToken, revokeRefreshToken, rotateRefreshToken } = require('../models/tokenModel');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

// POST /signup
async function signup(req, res) {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({ error: 'ID and password are required' });
    }

    // check that the user does not exist
    const existingUser = await findUserById(id);
    if (existingUser) {
      return res.status(409).json({ error: 'The user already exists' });
    }

    await createUser(id, password);

    // issue tokens immediately after registration
    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken();
    await saveRefreshToken(id, refreshToken);

    return res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    console.error('signup error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// POST /signin
async function signin(req, res) {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({ error: 'ID and password are required' });
    }

    const user = await findUserById(id);
    if (!user) {
      // Always respond the same way when credentials are invalid.
      return res.status(401).json({ error: 'Incorrect ID or password' });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect ID or password' });
    }

    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken();
    await saveRefreshToken(id, refreshToken);

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('signin error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// POST /signin/new_token
async function refreshToken(req, res) {
  try {
    const { refreshToken: oldRefreshToken } = req.body;

    if (!oldRefreshToken) {
      return res.status(400).json({ error: 'refreshToken is required' });
    }

    // Check that the token exists and has not been revoked
    const tokenRecord = await findRefreshToken(oldRefreshToken);
    if (!tokenRecord) {
      return res.status(401).json({ error: 'Invalid or revoked token' });
    }

    // revoke the old token, create a new pair
    const newAccessToken = generateAccessToken(tokenRecord.user_id);
    const newRefreshToken = generateRefreshToken();
    await rotateRefreshToken(oldRefreshToken, newRefreshToken, tokenRecord.user_id);

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('refreshToken error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// GET /info
async function getInfo(req, res) {
  // req.user is filled in authMiddleware
  return res.json({ id: req.user.id });
}


// GET /logout
async function logout(req, res) {
  try {
    // Obtain a refresh token from the request body.
    // Revoke ONLY that token; other devices continue to operate.
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'refreshToken is required' });
    }

    await revokeRefreshToken(token);
    return res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('logout error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { signup, signin, refreshToken, getInfo, logout };
