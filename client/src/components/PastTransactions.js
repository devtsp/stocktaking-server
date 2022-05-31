import React from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { FiDelete } from 'react-icons/fi';

import useAxiosPrivate from '../hooks/useAxiosPrivate';

const PastTransactions = () => {
	const axiosPrivate = useAxiosPrivate();
	const [transactions, setTransactions] = React.useState([]);

	const handleDelete = id => {
		console.log('Delete ' + id);
	};

	const handleEdit = id => {
		console.log('Edit ' + id);
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
		<section className="PastTransactions">
			{transactions ? (
				<>
					<h1>History</h1>
					<table>
						<thead>
							<tr>
								<th>Concept</th>
								<th>Amount</th>
							</tr>
						</thead>
						<tbody>
							{transactions.map((transaction, i) => (
								<tr key={transaction.id}>
									<td>{transaction.concept}</td>
									<td
										style={{
											color: +transaction.amount < 0 ? 'red' : 'yellowgreen',
										}}
									>
										{transaction.amount}
									</td>
									<td onClick={e => handleEdit(transaction.id)}>
										<button>
											<AiFillEdit />
										</button>
									</td>
									<td onClick={e => handleDelete(transaction.id)}>
										<button>
											<FiDelete />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</>
			) : (
				<h2>missing</h2>
			)}
		</section>
	);
};

export default PastTransactions;
