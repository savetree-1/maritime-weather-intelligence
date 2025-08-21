// backend/server.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
