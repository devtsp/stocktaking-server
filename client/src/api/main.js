import axios from 'axios';

const main = axios.create({ baseURL: 'http://localhost:5000/' });

export default main;
