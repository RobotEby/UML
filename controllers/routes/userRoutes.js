const express = require('express');
const { registerUser } = require('../userController');
const router = express.Router();

router.post('/register', userController.register);

router.post('/login', userController.login);

module.exports = router;
