const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController');

router
	.route('/')
	.get(transactionController.getAllTransactions)
	.post(transactionController.createTransaction)
	.delete(transactionController.removeTransaction)
	.patch(transactionController.updateTransaction);

module.exports = router;
