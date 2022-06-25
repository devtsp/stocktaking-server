import axios from 'axios';

const BASE_URL = 'https://stocktaking-app.azurewebsites.net/';

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-type': 'application/json' },
	withCredentials: true,
});

export default axios.create({ baseURL: BASE_URL });
