import React from 'react';
import { MdClose } from 'react-icons/md';

const EditPopup = ({ setIsEditing, transactionEdit, setTransactionEdit }) => {
	const [amount, setAmount] = React.useState('');
	const [concept, setConcept] = React.useState('');
	const [error, setError] = React.useState('');
	const { id, concept: prevConcept, amount: prevAmount } = transactionEdit;

	const handleSubmit = e => {
		e.preventDefault();
		const body = {
			amount,
			concept,
			id,
		};
		console.log(body);
	};

	return (
		<div className="EditPopup">
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
					<label htmlFor="edit-concept">Insert New Concept:</label>
					<input
						type="text"
						id="edit-concept"
						onChange={e => setConcept(e.target.value)}
					/>
				</div>
				{error && <div className="error">*{error}</div>}
				<div>
					<input type="submit" value="Confirm" />
				</div>
			</form>
		</div>
	);
};

export default EditPopup;
