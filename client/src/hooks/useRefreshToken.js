import useAuth from './useAuth';
import axios from '../api/axios';
import useLoading from './useLoading';

const useRefreshToken = () => {
	const { setAuth } = useAuth();
	const { setIsFetching } = useLoading();

	const refresh = async () => {
		try {
			setIsFetching(true);
			const response = await axios.get('/refresh', {
				withCredentials: true,
			});
			const accessToken = response?.data?.accessToken;
			setAuth({ accessToken });
			return response.data.accessToken;
		} catch (err) {
			console.error(err.message);
			setAuth({ acessToken: null });
		} finally {
			setIsFetching(false);
		}
	};

	return refresh;
};

export default useRefreshToken;
