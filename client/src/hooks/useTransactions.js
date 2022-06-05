import React from 'react';
import { TransactionContext } from '../context/TransactionProvider';

const useTransactions = () => {
	return React.useContext(TransactionContext);
};

export default useTransactions;
