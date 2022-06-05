import React from 'react';

import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

const PersistLogin = ({ children }) => {
	const [isLoading, setIsLoading] = React.useState(true);
	const refresh = useRefreshToken();
	const { auth } = useAuth();

	React.useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (err) {
				console.error(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		!auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
	}, []);

	return isLoading ? <p>Loading..</p> : children;
};

export default PersistLogin;
