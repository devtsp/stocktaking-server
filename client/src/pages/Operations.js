import React from 'react';
import EditPopup from '../components/EditPopup';

import NewTransaction from '../components/NewTransaction';
import History from '../components/History';

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
					<History
						setIsEditing={setIsEditing}
						setTransactionEdit={setTransactionEdit}
					/>
				</>
			)}
		</div>
	);
};

export default Operations;
