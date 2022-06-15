import React from 'react';

import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

const PersistLogin = ({ children }) => {
	const refresh = useRefreshToken();
	const { auth } = useAuth();

	React.useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (err) {
				console.error(err.message);
			}
		};

		!auth?.accessToken && verifyRefreshToken();
	}, []);

	return children;
};

export default PersistLogin;
