const pool = require('../config/db');

// saveRefreshToken in db (login/reg)
async function saveRefreshToken(userId, token) {
  await pool.execute(
    'INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)',
    [userId, token]
  );
}

// Find the token in the database and check that it has not been revoked.
async function findRefreshToken(token) {
  const [rows] = await pool.execute(
    'SELECT * FROM refresh_tokens WHERE token = ? AND is_revoked = FALSE',
    [token]
  );
  return rows[0];
}

// Revoke a specific token (logout one device)
async function revokeRefreshToken(token) {
  await pool.execute(
    'UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = ?',
    [token]
  );
}

// Replace the old refresh token with a new one (token rotation)
// This is an important security practice: each time a refresh
// occurs, the old token becomes invalid and a new one is issued.
async function rotateRefreshToken(oldToken, newToken, userId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      'UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = ?',
      [oldToken]
    );
    await connection.execute(
      'INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)',
      [userId, newToken]
    );

    // A transaction guarantees that either both requests will be fulfilled,
    // or neither. Without it, a situation could arise where the old token
    // is revoked and a new one is not created.
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  saveRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  rotateRefreshToken
};
