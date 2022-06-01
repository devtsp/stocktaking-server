import React from 'react';
import EditTranasction from '../components/EditTransaction';

import NewTransaction from '../components/NewTransaction';
import TransactionHistory from '../components/TransactionHistory';

const Operations = () => {
	const [isEditing, setIsEditing] = React.useState(false);
	const [transactionEdit, setTransactionEdit] = React.useState({});
	return (
		<div className="Operations">
			{isEditing ? (
				<EditTranasction
					setIsEditing={setIsEditing}
					transactionEdit={transactionEdit}
				/>
			) : (
				<>
					<NewTransaction />
					<TransactionHistory
						setIsEditing={setIsEditing}
						setTransactionEdit={setTransactionEdit}
					/>
				</>
			)}
		</div>
	);
};

export default Operations;
