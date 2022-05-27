const express = require('express');
const router = express.Router();

const transactionsController = require('../controllers/transactionsController');

router
	.route('/')
	.get(transactionsController.getAllTransactions)
	.post(transactionsController.createTransaction)
	.delete(transactionsController.removeTransaction)
	.patch(transactionsController.updateTransaction);

module.exports = router;
