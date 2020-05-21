import axios from './axios';
const api = {
	hotList() {
		return axios.get('/hotList');
	},
	info(id) {
		return axios.get('/info', {
			params: {
				id
			}
		});
	}
};
export default api;