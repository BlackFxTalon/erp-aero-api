const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// create new user
async function createUser(id, password) {
    // pass hash. Number 10 is the cost factor (hash difficulty)
    // more the number, the longer is hashing, and more diffcult is brutforce
    // number 10 is standart between sec
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
    'INSERT INTO users (id, password) VALUES (?, ?)',
    [id, hashedPassword]
    // symbols ? is guaring from sql injections.
   );
}

// findUserById
async function findUserById(id) {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  // pool.execute returns an array [rows, fields].
  // we need only rows
  return rows[0]; // undefined if not found
}

// verifyPassword
async function verifyPassword(plainPassword, hashedPassword) {
  // bcrypt.compare automatically hashes plainPassword and compares it to the hash.
  // Never compare passwords with ==, only with bcrypt.compare!
  return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {createUser, findUserById, verifyPassword};
