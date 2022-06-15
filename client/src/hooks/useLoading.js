import React from 'react';

import { LoadingContext } from '../context/LoadingProvider';

const useLoading = () => {
	return React.useContext(LoadingContext);
};

export default useLoading;
