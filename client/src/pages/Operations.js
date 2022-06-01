import React from 'react';
import { Navigate } from 'react-router-dom';
import EditTranasction from '../components/EditTransaction';

import NewTransaction from '../components/NewTransaction';
import TransactionHistory from '../components/TransactionHistory';
import useAuth from '../hooks/useAuth';

const Operations = () => {
	const [isEditing, setIsEditing] = React.useState(false);
	const [transactionEdit, setTransactionEdit] = React.useState({});
	const { auth } = useAuth();
	return (
		<>
			{auth?.user ? (
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
			) : (
				<Navigate to="/login" />
			)}
		</>
	);
};

export default Operations;
