import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Home = () => {
	const navigate = useNavigate();

	const [balance, setBalance] = React.useState(null);
	const [transactions, setTransactions] = React.useState(null);
	const [loading, setIsLoading] = React.useState(false);

	const { auth } = useAuth();
	const axiosPrivate = useAxiosPrivate();

	const [mounted, setIsMounted] = React.useState(false);

	React.useEffect(() => {
		let isMounted = true;
		setIsMounted(true);
		const controller = new AbortController();

		const getBalance = async () => {
			try {
				const response = await axiosPrivate.get('/transactions/balance', {
					signal: controller.signal,
				});
				isMounted && setBalance(response.data.balance);
			} catch (error) {
				console.error(error.message);
			}
		};

		const getLastTransactions = async () => {
			try {
				const response = await axiosPrivate.get('/transactions', {
					signal: controller.signal,
				});
				isMounted && setTransactions(response?.data);
			} catch (err) {
				console.error(err.message);
			}
		};

		const fetchData = async () => {
			setIsLoading(true);
			await getBalance();
			await getLastTransactions();
			setIsLoading(false);
		};

		fetchData();

		return () => {
			// isMounted = false;
			// !loading && controller.abort();
		};
	}, []);

	return (
		<>
			{auth?.user ? (
				<section
					className={`Home transition1 ${
						!mounted ? 'transition1-start' : 'transition1-end'
					} `}
				>
					<p>
						<span>Balance:</span> <span>{balance || 0}</span>
					</p>
					<section className="TransactionHistory">
						<h1>Last Movements</h1>
						{transactions ? (
							<table>
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
														color:
															+transaction.amount < 0 ? 'red' : 'yellowgreen',
													}}
												>
													{transaction.amount}
												</td>
												<td>{transaction.concept}</td>
												<td>{formattedDate}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						) : (
							<p>No transactions to display yet.</p>
						)}
					</section>
				</section>
			) : (
				<Navigate to="/login" />
			)}
		</>
	);
};

export default Home;
