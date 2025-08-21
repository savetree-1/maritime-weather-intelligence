const express = require('express');
const router = express.Router();

router.get('/api/status', (req, res) => {
  res.json({ status: 'Backend running' });
});

module.exports = router;
