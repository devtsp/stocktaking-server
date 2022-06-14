import React from 'react';
import { Link, Navigate } from 'react-router-dom';

import { AiOutlineRight } from 'react-icons/ai';

import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Home = () => {
	const [balance, setBalance] = React.useState(0);
	const [transactions, setTransactions] = React.useState([]);
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
				isMounted && setBalance(response.data);
			} catch (err) {
				if (err.message !== 'canceled') {
					console.error(err);
				}
			}
		};

		const getLastTransactions = async () => {
			try {
				const response = await axiosPrivate.get('/transactions?limit=10', {
					signal: controller.signal,
				});
				isMounted && response.data && setTransactions(response.data);
			} catch (err) {
				if (err.message !== 'canceled') {
					console.error(err);
				}
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
			isMounted = false;
			controller.abort();
		};
	}, []);

	return (
		<>
			{auth?.accessToken && !loading ? (
				<section
					className={`Home transition1 ${
						!mounted ? 'transition1-start' : 'transition1-end'
					} `}
				>
					<p>
						<span>Balance:</span> <span>{balance || 0}</span>
					</p>
					<article className="TransactionHistory">
						<h1>Last Movements</h1>
						{transactions.length ? (
							<>
								<div className="transparency-mask"></div>
								<table>
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
								<div>. . . .</div>
							</>
						) : (
							<p>
								No transactions to display yet.{' '}
								<Link to="/operations">
									Start Operating <AiOutlineRight />
								</Link>
							</p>
						)}
					</article>
				</section>
			) : (
				<Navigate to="/login" />
			)}
		</>
	);
};

export default Home;
