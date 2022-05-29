import React from 'react';
import main from '../api/main';

const Dashboard = () => {
	const [balance, setBalance] = React.useState();

	React.useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getBalance = async () => {
			try {
				const response = await main.get('/transactions/balance', {
					signal: controller.signal,
				});
				console.log(response.data);
				isMounted && setBalance(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		getBalance();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [setBalance]);
	return (
		<div>
			<h1>Dasboard</h1>
			<ul></ul>
		</div>
	);
};

export default Dashboard;
