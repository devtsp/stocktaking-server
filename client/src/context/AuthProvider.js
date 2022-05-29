import React from 'react';

const AuthContext = React.createContext({});

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = React.useState({});
	console.log(auth);

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
