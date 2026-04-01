const pool = require('./db');

async function migrate() {
    const connection = await pool.getConnection();

    try {
        // users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
              id VARCHAR(255) PRIMARY KEY,
              password VARCHAR(255) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )  
            `);
        console.log('✅ table users ready');

        // resresh tokens table
        // one string = one auth device
        // user_id + token - we know whose token it is and can revoke a specific one
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS refresh_tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            token VARCHAR(512) NOT NULL UNIQUE,
            is_revoked BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        `);
    console.log('✅ refresh_tokens table ready');

     // files table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        original_name VARCHAR(255) NOT NULL,
        extension VARCHAR(50),
        mime_type VARCHAR(100),
        size INT,
        path VARCHAR(500) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ files table готова');

    console.log('🎉 migrations completed successfully');
    } catch (error) {
        console.error('❌ migrations error:', error);
    } finally {
        // important to release connection back to pool
        connection.release();
        process.exit(0);
    }
}

migrate();