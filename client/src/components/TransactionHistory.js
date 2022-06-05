import React from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { FiDelete } from 'react-icons/fi';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useTransactions from '../hooks/useTransactions';

const TransactionHistory = ({ setIsEditing, setTransactionEdit }) => {
	const axiosPrivate = useAxiosPrivate();
	const { transactions, setTransactions } = useTransactions();

	const [mounted, setIsMounted] = React.useState(false);

	const handleDelete = async ({ id }) => {
		try {
			await axiosPrivate.delete('/transactions', {
				data: { id },
			});
			setTransactions(transactions.filter(tr => tr.id !== id));
		} catch (err) {
			console.error(err.response.message);
		}
	};

	const handleEdit = operation => {
		setTransactionEdit(operation);
		setIsEditing(true);
	};

	React.useEffect(() => {
		let isMounted = true;
		setIsMounted(true);
		const controller = new AbortController();

		const getPastTransactions = async () => {
			try {
				const response = await axiosPrivate.get('/transactions', {
					signal: controller.signal,
				});
				const transactions = response?.data;
				isMounted && setTransactions(transactions);
			} catch (err) {
				console.error(err.message);
			}
		};

		getPastTransactions();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	return (
		<section
			className={`TransactionHistory transition1 ${
				!mounted ? 'transition1-start' : 'transition1-end'
			}`}
		>
			<h1>Transaction History</h1>
			{transactions ? (
				<table>
					<thead>
						<tr>
							<th>Amount</th>
							<th>Concept</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{transactions.map((transaction, i) => {
							const originalDate = new Date(transaction.createdAt);
							const formattedDate = `${originalDate.getDate()}/${
								originalDate.getMonth() + 1
							}/${originalDate.getFullYear()}`;
							return (
								<tr key={transaction.id}>
									<td
										style={{
											color: +transaction.amount < 0 ? 'red' : 'yellowgreen',
										}}
									>
										{transaction.amount}
									</td>
									<td>{transaction.concept}</td>
									<td>{formattedDate}</td>
									<td onClick={e => handleEdit(transaction)}>
										<button>
											<AiFillEdit />
										</button>
									</td>
									<td onClick={e => handleDelete(transaction)}>
										<button>
											<FiDelete />
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			) : (
				<p>No transactions to display yet.</p>
			)}
		</section>
	);
};

export default TransactionHistory;
