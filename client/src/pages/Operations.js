import React from 'react';
import { Navigate } from 'react-router-dom';
import EditTranasction from '../components/EditTransaction';

import NewTransaction from '../components/NewTransaction';
import TransactionHistory from '../components/TransactionHistory';
import useAuth from '../hooks/useAuth';

const Operations = () => {
	const [editing, setEditing] = React.useState([false, {}]);
	const { auth } = useAuth();
	return (
		<>
			{auth?.user ? (
				<div className="Operations">
					{editing[0] ? (
						<EditTranasction editing={editing} setEditing={setEditing} />
					) : (
						<>
							<NewTransaction />
							<TransactionHistory editing={editing} setEditing={setEditing} />
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
