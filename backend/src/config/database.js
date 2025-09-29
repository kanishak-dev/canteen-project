const { Pool } = require('pg');

// Load environment variables.
require('dotenv').config();

// Create the connection pool using the DATABASE_URL from your .env file.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export the entire pool.
module.exports = pool;