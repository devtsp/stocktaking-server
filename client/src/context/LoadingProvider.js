import React from 'react';

export const LoadingContext = React.createContext({});

const LoadingProvider = ({ children }) => {
	const [fetching, setIsFetching] = React.useState(false);

	return (
		<LoadingContext.Provider value={{ fetching, setIsFetching }}>
			{children}
		</LoadingContext.Provider>
	);
};

export default LoadingProvider;
