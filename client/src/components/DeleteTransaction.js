import React from 'react';

import useAxiosPrivate from '../hooks/useAxiosPrivate';

const DeleteTransaction = ({ deleting, setDeleting }) => {
	const { id, concept, amount, createdAt, modifiedAt } = deleting[1];

	const [confirm, setConfirm] = React.useState(false);

	const axiosPrivate = useAxiosPrivate();

	const handleDelete = async e => {
		e.preventDefault();

		!confirm && setDeleting([false, {}]);

		try {
			await axiosPrivate.delete('/transactions', {
				data: { id },
			});
			setDeleting([false, {}]);
		} catch (err) {
			console.error(err.response.message);
		}
	};

	return (
		<article className="DeleteTransaction">
			<h1>DeleteTransaction</h1>
			<div className="transaction-info">
				<h2>Transaction Info</h2>
				<ul>
					<li>
						<h3>Transaction ID:</h3>
						<span>{id}</span>
					</li>
					<li>
						<h3>Transaction Concept:</h3>
						<span>{concept}</span>
					</li>
					<li>
						<h3>Amount:</h3>
						<span>{amount}</span>
					</li>
					<li>
						<h3>First Created At:</h3>
						<span>
							{
								createdAt
									.toString()
									.split('GMT')[0]
									.replace('T', '  ')
									.split('.')[0]
							}
						</span>
					</li>
					{modifiedAt && (
						<li>
							<h3>Last Modified:</h3>
							<span>
								{
									modifiedAt
										.toString()
										.split('GMT')[0]
										.replace('T', '  ')
										.split('.')[0]
								}
							</span>
						</li>
					)}
				</ul>
			</div>
			<form onSubmit={handleDelete}>
				<p className="delete-confirmation error">
					Are you sure you want to delete this transaction from the history?{' '}
					<br />
					<strong>
						{' '}
						<u> This action can't be undone</u>
					</strong>
				</p>
				<div>
					<div className="field">
						<input
							id="cancel-delete"
							type="radio"
							checked={!confirm}
							onChange={() => setConfirm(false)}
						/>
						<label htmlFor="cancel-delete">Cancel</label>
					</div>
					<div className="field">
						<input
							id="confirm-delete"
							type="radio"
							checked={confirm}
							onChange={() => setConfirm(true)}
						/>
						<label htmlFor="confirm-delete">Confirm</label>
					</div>
				</div>
				<input type="submit" value="Proceed" />
			</form>
		</article>
	);
};

export default DeleteTransaction;
