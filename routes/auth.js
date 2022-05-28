const express = require('express');
const router = express.Router();
const logUser = require('../controllers/authController');

router.route('/').post(logUser);

module.exports = router;
