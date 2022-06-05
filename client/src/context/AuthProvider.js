import React from 'react';

const AuthContext = React.createContext({});

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = React.useState({ user: null, accessToken: null });

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
