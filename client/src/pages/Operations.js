import React from 'react';

import NewTransaction from '../components/NewTransaction';
import PastTransactions from '../components/PastTransactions';

const Operations = () => {
	return (
		<div className="Operations">
			<NewTransaction />
			<PastTransactions />
		</div>
	);
};

export default Operations;
