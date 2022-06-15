import React from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { FiDelete, FiFilter } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import { IconContext } from 'react-icons';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useTransactions from '../hooks/useTransactions';
import useLoading from '../hooks/useLoading';

const TransactionHistory = ({ setEditing, setDeleting }) => {
	const axiosPrivate = useAxiosPrivate();
	const { transactions, setTransactions } = useTransactions();
	const { fetching, setIsFetching } = useLoading();

	const [filters, setFilters] = React.useState([]);
	const [mounted, setIsMounted] = React.useState(false);

	React.useEffect(() => {
		let isMounted = true;
		setIsMounted(true);
		setIsFetching(true);
		const controller = new AbortController();

		const getPastTransactions = async () => {
			try {
				const response = await axiosPrivate.get('/transactions', {
					signal: controller.signal,
				});
				const transactions = response?.data;
				isMounted && response.data && setTransactions(transactions);
			} catch (err) {
				if (err.message !== 'canceled') {
					console.error(err);
				}
			}
		};

		getPastTransactions();
		isMounted && setIsFetching(false);

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	const handleDeleteFilter = (e, filter) => {
		const updatedFilters = filters.length
			? [...filters].filter(f => f !== filter)
			: [e.target.value];
		setFilters(updatedFilters);
	};

	const handleAddFilter = e => {
		const updatedFilters = filters.length
			? [...new Set([...filters, e.target.value])]
			: [e.target.value];
		setFilters(updatedFilters);
	};

	const filterTransactionsCallback = transaction => {
		return filters.length ? filters.includes(transaction.concept) : true;
	};

	const formatDate = UTCDate => {
		const originalDate = new Date(UTCDate);
		return `${originalDate.getDate()}/${
			originalDate.getMonth() + 1
		}/${originalDate.getFullYear()}`;
	};

	return (
		<article
			className={`TransactionHistory transition1 ${
				!mounted ? 'transition1-start' : 'transition1-end'
			}`}
		>
			<h1>Transaction History</h1>
			{transactions.length ? (
				<>
					<form>
						{filters && (
							<ul className="filter-tag-list">
								<li>
									<label htmlFor="filter-select">Filter Transactions</label>
									<IconContext.Provider value={{ size: '2rem' }}>
										<FiFilter />
									</IconContext.Provider>
									<select
										className="filter-select"
										value="Filter Concept"
										onChange={e => handleAddFilter(e)}
									>
										<option>Filter Concept</option>
										{conceptArray.map((concept, i) => (
											<option value={concept} key={i}>
												{concept}
											</option>
										))}
									</select>
								</li>
								{filters.map(filter => (
									<li
										key={filter}
										className="filter-tag"
										onClick={e => handleDeleteFilter(e, filter)}
									>
										<span> {filter}</span>
										<IconContext.Provider value={{ size: '1rem' }}>
											<MdClose />
										</IconContext.Provider>{' '}
									</li>
								))}
							</ul>
						)}
					</form>
					<table>
						<thead>
							<tr>
								<th>Amount</th>
								<th>Concept</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{transactions
								.filter(filterTransactionsCallback)
								.map(transaction => {
									const date = formatDate(transaction.createdAt);
									return (
										<tr key={transaction.id}>
											<td
												style={{
													color:
														+transaction.amount < 0 ? 'red' : 'yellowgreen',
												}}
											>
												{transaction.amount}
											</td>
											<td>{transaction.concept}</td>
											<td>{date}</td>
											<td onClick={e => setEditing([true, transaction])}>
												<button>
													<AiFillEdit />
												</button>
											</td>
											<td onClick={e => setDeleting([true, transaction])}>
												<button>
													<FiDelete />
												</button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</>
			) : (
				<p>No transactions to display yet.</p>
			)}
		</article>
	);
};

const conceptArray = [
	'groceries',
	'loan',
	'fees',
	'rent',
	'salary',
	'gas',
	'medic',
	'shopping',
	'other',
];

export default TransactionHistory;
