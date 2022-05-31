import jwtDecode from 'jwt-decode';

import useAuth from './useAuth';
import axios from '../api/axios';

const useRefreshToken = () => {
	const { setAuth } = useAuth();
	const refresh = async () => {
		const response = await axios.get('/refresh', {
			withCredentials: true,
		});
		const accessToken = response?.data?.accessToken;
		const user = jwtDecode(accessToken)?.UserInfo.user;
		setAuth(prev => {
			return { ...prev, user, accessToken };
		});
		return response.data.accessToken;
	};
	return refresh;
};

export default useRefreshToken;
