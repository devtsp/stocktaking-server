import React from 'react';

import { axiosPrivate } from '../api/axios';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';

const useAxiosPrivate = () => {
	const refresh = useRefreshToken();
	const { auth } = useAuth();

	React.useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			config => {
				if (!config.headers['Authorization']) {
					config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
				}
				return config;
			},
			error => Promise.reject(error)
		);

		const responseIntercept = axiosPrivate.interceptors.response.use(
			response => {
				return response;
			},
			async error => {
				const prevRequest = error?.config;
				if (error?.response?.status === 403 && !prevRequest?.sent) {
					const accessToken = await refresh();
					prevRequest.headers['Authorization'] = `Bearer ${accessToken}`;
					prevRequest.sent = true;
					return axiosPrivate(prevRequest);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosPrivate.interceptors.response.eject(responseIntercept);
			axiosPrivate.interceptors.request.eject(requestIntercept);
		};
	}, [auth, refresh]);

	return axiosPrivate;
};

export default useAxiosPrivate;
