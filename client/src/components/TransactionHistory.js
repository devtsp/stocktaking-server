import React from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { FiDelete } from 'react-icons/fi';

import useAxiosPrivate from '../hooks/useAxiosPrivate';

const TransactionHistory = ({ setIsEditing, setTransactionEdit }) => {
	const axiosPrivate = useAxiosPrivate();
	const [transactions, setTransactions] = React.useState([]);

	const handleDelete = async transaction => {
		console.log(transaction);
		const toSend = { id: transaction.id };
		console.log(toSend);
		try {
			await axiosPrivate.delete('/transactions', { data: toSend });
			window.location.reload();
		} catch (err) {
			console.error(err.response);
		}
	};

	const handleEdit = operation => {
		setTransactionEdit(operation);
		setIsEditing(true);
	};

	React.useEffect(() => {
		const getPastTransactions = async () => {
			try {
				const response = await axiosPrivate.get('/transactions');
				const transactions = response?.data;
				setTransactions(transactions);
			} catch (err) {
				console.error(err.message);
			}
		};

		getPastTransactions();
	}, [axiosPrivate]);

	return (
		<section className="TransactionHistory">
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
							const formattedDate = `${originalDate.getDay()}/${
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
