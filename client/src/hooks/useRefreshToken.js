import useAuth from './useAuth';
import main from '../api/main';

const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refresh = async () => {
		const response = await main.get('/refresh', {
			withCredentials: true,
		});
		setAuth(prev => {
			console.log(JSON.stringify(prev));
			console.log(response.data.accessToken);
			return { ...prev, accessToken: response.data.accessToken };
		});
		return response.data.accessToken;
	};
	return refresh;
};

export default useRefreshToken;
