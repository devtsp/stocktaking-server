const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

router.route('/', registerController.registerNewUser);

module.exports = router;
