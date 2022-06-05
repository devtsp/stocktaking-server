import React from 'react';
import { Outlet } from 'react-router-dom';

export const TransactionContext = React.createContext({});

export const TransactionProvider = ({ children }) => {
	const [transactions, setTransactions] = React.useState([]);

	return (
		<TransactionContext.Provider value={{ transactions, setTransactions }}>
			<Outlet />
		</TransactionContext.Provider>
	);
};

export default TransactionProvider;
