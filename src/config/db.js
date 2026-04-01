const mysql = require('mysql2/promise');
require('dotenv').config();


// create request pool for parallel connections, not one (createPool)

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,    // max 10 parallel requests
    queueLimit: 0           // no que limit
});

module.exports = pool;