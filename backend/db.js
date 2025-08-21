// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'maritime_weather',
  password: process.env.PGPASSWORD || 'adminpost',
  port: process.env.PGPORT || 5432,
});

module.exports = pool;
