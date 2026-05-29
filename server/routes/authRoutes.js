const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username === 'admin' && password === 'support123') {
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || 'your_secret_key_here',
      { expiresIn: '24h' }
    );
    return res.json({ token });
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;
