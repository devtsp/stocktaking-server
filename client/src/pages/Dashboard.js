import React from 'react';
import { useNavigate } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Dashboard = () => {
	const navigate = useNavigate();

	const [balance, setBalance] = React.useState(null);
	const axiosPrivate = useAxiosPrivate();

	React.useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getBalance = async () => {
			try {
				const response = await axiosPrivate.get('/transactions/balance', {
					signal: controller.signal,
				});
				isMounted && setBalance(response.data.balance);
			} catch (error) {
				console.error(error.message);
				navigate('/login');
			}
		};

		getBalance();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [axiosPrivate]);

	return (
		<section className="Dashboard">
			<h1>Dashboard</h1>
			<p>
				<span>Balance:</span> <span>{balance || 0}</span>
			</p>
		</section>
	);
};

export default Dashboard;
