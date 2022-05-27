const express = require('express');
const router = express.Router();

const transactions = require('../controllers/transactions');

router
	.route('/')
	.get(transactions.getAll)
	.post(transactions.create)
	.delete(transactions.remove)
	.patch(transactions.update);

module.exports = router;
