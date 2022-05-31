import React from 'react';
import EditPopup from '../components/EditPopup';

import NewTransaction from '../components/NewTransaction';
import PastTransactions from '../components/PastTransactions';

const Operations = () => {
	const [isEditing, setIsEditing] = React.useState(false);
	return (
		<div className="Operations">
			{isEditing ? (
				<EditPopup setIsEditing={setIsEditing} />
			) : (
				<>
					<NewTransaction />
					<PastTransactions setIsEditing={setIsEditing} />
				</>
			)}
		</div>
	);
};

export default Operations;
