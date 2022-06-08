import React from 'react';
import { Navigate } from 'react-router-dom';
import EditTranasction from '../components/EditTransaction';

import NewTransaction from '../components/NewTransaction';
import TransactionHistory from '../components/TransactionHistory';
import DeleteTransaction from '../components/DeleteTransaction';
import useAuth from '../hooks/useAuth';

const Operations = () => {
	const [editing, setEditing] = React.useState([false, {}]);
	const [deleting, setDeleting] = React.useState([false, {}]);
	const { auth } = useAuth();
	return (
		<>
			{!auth.user && <Navigate to="/login" />}

			<div className="Operations">
				{editing[0] && (
					<EditTranasction editing={editing} setEditing={setEditing} />
				)}

				{deleting[0] && (
					<DeleteTransaction deleting={deleting} setDeleting={setDeleting} />
				)}

				{!deleting[0] && !editing[0] && (
					<>
						<NewTransaction />
						<TransactionHistory
							setEditing={setEditing}
							setDeleting={setDeleting}
						/>
					</>
				)}
			</div>
		</>
	);
};

export default Operations;
