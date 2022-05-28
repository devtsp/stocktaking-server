const express = require('express');
const router = express.Router();
const logoutUser = require('../controllers/logoutCOntroller');

router.route('/').post(logoutUser);

module.exports = router;
