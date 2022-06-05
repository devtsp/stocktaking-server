import jwtDecode from 'jwt-decode';

import useAuth from './useAuth';
import axios from '../api/axios';

const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refresh = async () => {
		try {
			const response = await axios.get('/refresh', {
				withCredentials: true,
			});
			const accessToken = response?.data?.accessToken;
			const user = jwtDecode(accessToken)?.UserInfo.user;
			setAuth({ user, accessToken });
			return response.data.accessToken;
		} catch (err) {
			console.error(err.message);
			setAuth({ user: null, refreshToken: null });
		}
	};

	return refresh;
};

export default useRefreshToken;
