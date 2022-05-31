import React from 'react';

import useAxiosPrivate from '../hooks/useAxiosPrivate';

const NewTransaction = () => {
	const axiosPrivate = useAxiosPrivate();
	const [amount, setAmount] = React.useState('');
	const [concept, setConcept] = React.useState('');
	const [type, setType] = React.useState('');
	const [error, setError] = React.useState('');

	const submitTransaction = async e => {
		e.preventDefault();
		if (!amount?.trim() || !type?.trim() || !concept?.trim()) {
			setError('Select amount, concept and type to proceed');
			return;
		}

		try {
			const response = await axiosPrivate.post(
				'/transactions',
				JSON.stringify({ amount, type, concept })
			);
			console.log(response.data);
			setAmount('');
			setConcept('');
			setType('');
			setError('');
			window.location.reload();
		} catch (err) {
			if (!err?.response) {
				setError('No server Response');
			} else if (err.response?.status === 400) {
				setError('Missing Fields');
			} else if (err.response?.status === 401) {
				setError('You are logged out');
			} else {
				setError('Transaction Failed');
			}
		}
	};

	return (
		<form className="NewTransaction" onSubmit={submitTransaction}>
			<h1>New Transaction</h1>
			<div>
				<label htmlFor="transaction-amount">Amount</label> <br />
				<input
					type="number"
					id="transaction-amount"
					onChange={e => setAmount(e.target.value)}
					autoComplete="off"
					value={amount}
					required
				/>
			</div>
			<div>
				<label htmlFor="transaction-concept">Concept</label> <br />
				<select
					id="transaction-concept"
					onChange={e => setConcept(e.target.value)}
					defaultValue=""
					required
				>
					<option disabled value="">
						Select
					</option>
					{conceptArray.map((concept, i) => (
						<option value={concept} key={i}>
							{concept}
						</option>
					))}
				</select>
			</div>
			<h2>Select Type of Transaction</h2>
			<div className="field">
				<input
					type="radio"
					id="transaction-type-in"
					onClick={e => setType(e.target.value)}
					checked={type === 'IN'}
					readOnly
					autoComplete="off"
					value="IN"
					required
				/>
				<label htmlFor="transaction-type-in">Income</label> <br />
			</div>
			<div className="field">
				<input
					type="radio"
					id="transaction-type-out"
					onClick={e => setType(e.target.value)}
					checked={type === 'OUT'}
					readOnly
					autoComplete="off"
					value="OUT"
					required
				/>
				<label htmlFor="transaction-type-out">Outcome</label> <br />
			</div>
			{error && <div className="error">*{error}</div>}
			<div>
				<input type="submit" value="Submit" />
			</div>
		</form>
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

export default NewTransaction;
