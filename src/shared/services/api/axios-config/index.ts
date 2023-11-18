import { errorIntercepto } from './interceptors/ErrorInterceptor';
import { responseInterceptor } from './interceptors/ResponseInterceptor';
import axios from 'axios';
import { Environment } from '../../../environment';

const Api = axios.create({
	baseURL: Environment.URL_BASE,
});

Api.interceptors.response.use(
	(response) => responseInterceptor(response), 
	(error) => errorIntercepto(error)
);

export { Api };