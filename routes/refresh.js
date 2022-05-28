const express = require('express');
const router = express.Router();
const refreshToken = require('../controllers/refreshTokenController');

router.route('/').post(refreshToken);

module.exports = router;
