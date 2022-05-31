import React from 'react';
import { MdCancel } from 'react-icons/md';

const EditPopup = props => {
	const [amount, setAmount] = React.useState('');
	const [concept, setConcept] = React.useState('');
	const [error, setError] = React.useState('');

	const handleSubmit = () => {};

	return (
		<div className="EditPopup">
			<button className="cancel-button">
				<MdCancel />
			</button>
			<form>
				<h1>Edit Transaction</h1>
				{/* <p>Transaction ID: <span>props</span></p> */}
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
						type="number"
						id="edit-concept"
						onChange={e => setConcept(e.target.value)}
					/>
				</div>
				{error && <div className="error">*{error}</div>}
				<div>
					<input type="submit" value="Submit" />
				</div>
			</form>
		</div>
	);
};

export default EditPopup;
