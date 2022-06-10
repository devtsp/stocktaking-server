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
			setAuth({ accessToken });
			return response.data.accessToken;
		} catch (err) {
			console.error(err.message);
			setAuth({ refreshToken: null });
		}
	};

	return refresh;
};

export default useRefreshToken;
