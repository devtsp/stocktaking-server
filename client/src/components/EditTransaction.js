import React from 'react';
import { MdClose } from 'react-icons/md';

import useAxiosPrivate from '../hooks/useAxiosPrivate';

const EditTransaction = ({ setIsEditing, transactionEdit }) => {
	const axiosPrivate = useAxiosPrivate();
	const [amount, setAmount] = React.useState(transactionEdit.amount);
	const [concept, setConcept] = React.useState(transactionEdit.concept);
	const [error, setError] = React.useState('');
	const { id, concept: prevConcept, amount: prevAmount } = transactionEdit;

	const handleSubmit = async e => {
		e.preventDefault();
		const body = {
			amount,
			concept,
			id,
		};
		try {
			await axiosPrivate.patch('/transactions', body);
			setIsEditing(false);
		} catch (err) {
			console.error(error.message);
			setError(err.message);
		}
	};

	return (
		<div className="EditTransaction">
			<button className="cancel-button" onClick={() => setIsEditing(false)}>
				<MdClose />
			</button>
			<h1>Edit Transaction</h1>
			<div className="transaction-info">
				<h2>Transaction Info</h2>
				<ul>
					<li>
						<h3>Transaction ID:</h3>
						<span>{id}</span>
					</li>
					<li>
						<h3>Transaction Concept:</h3>
						<span>{prevConcept}</span>
					</li>
					<li>
						<h3>Transaction Amount:</h3>
						<span>{prevAmount}</span>
					</li>
				</ul>
			</div>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="edit-amount">Insert New Amount:</label>
					<input
						type="number"
						id="edit-amount"
						onChange={e => setAmount(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="edit-concept">Insert New Concept</label> <br />
					<select
						id="edit-concept"
						onChange={e => setConcept(e.target.value)}
						defaultValue=""
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
				{error && <div className="error">*{error}</div>}
				<div>
					<input type="submit" value="Confirm" />
				</div>
			</form>
		</div>
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

export default EditTransaction;
