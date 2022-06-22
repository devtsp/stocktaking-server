import axios from 'axios';

const BASE_URL = 'https://shaded-adventurous-red.glitch.me/';

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-type': 'application/json' },
	withCredentials: true,
});

export default axios.create({ baseURL: BASE_URL });
