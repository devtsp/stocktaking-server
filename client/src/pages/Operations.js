import React from 'react';
import EditPopup from '../components/EditPopup';

import NewTransaction from '../components/NewTransaction';
import PastTransactions from '../components/PastTransactions';

const Operations = () => {
	const [isEditing, setIsEditing] = React.useState(false);
	const [transactionEdit, setTransactionEdit] = React.useState({});
	return (
		<div className="Operations">
			{isEditing ? (
				<EditPopup
					setIsEditing={setIsEditing}
					transactionEdit={transactionEdit}
					setTransactionEdit={setTransactionEdit}
				/>
			) : (
				<>
					<NewTransaction />
					<PastTransactions
						setIsEditing={setIsEditing}
						setTransactionEdit={setTransactionEdit}
					/>
				</>
			)}
		</div>
	);
};

export default Operations;
