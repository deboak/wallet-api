const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/auth');

router.get('/test', (req, res) => {
  res.json({ msg: 'Auth route is working' });
});

router.post('/register', register);
router.post('/login', login);

module.exports = router;



