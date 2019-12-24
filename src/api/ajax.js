const axios = require('axios');
import store from '@/api/store';
const baseURL = store.baseURL;
let source = axios.CancelToken.source();
const service = axios.create({
	baseURL,
	timeout: 0
});
function getToken() {
	return store.session('token') || '';
}
service.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
service.interceptors.request.use(
	config => {
		config.headers.token = getToken();
		config.cancelToken = source.token;
		store.debug && console.info('[request] ', config.baseURL + config.url, config.params, config.data);
		return config;
	},
	function(error) {
		console.info('[request error] ', error);
		return Promise.reject(error);
	}
);
export async function Get(url, params) {
	return Request(url, params, 'get');
}
export async function Post(url, data, parmas) {
	return Request(url, data, 'post', parmas);
}
export async function Put(url, parmas) {
	return Request(url, parmas, 'put');
}
export async function Delete(url, parmas) {
	return Request(url, parmas, 'delete');
}
export async function Request(url, data, method, params) {
	method = (method || 'post').toUpperCase();
	data = data || {};
	params = params || {};
	let res = {};
	let body = method === 'POST' ? { url, data, method, params } : { url, params: data, method };
	function format(obj) {
		for (let p in obj) {
			let v = obj[p];
			if (v === null || v === undefined) {
				delete obj[p];
			} else if (v instanceof Date) {
				obj[p] = v.getTime();
			} else if (typeof v === 'number' || typeof v === 'string') {
				v = v;
			} else {
				format(v);
			}
		}
	}
	format(body.data);
	format(body.params);
	try {
		res = await service(body);
	} catch (e) {
		if (axios.isCancel(e)) {
			console.log('请求已取消：' + service.defaults.baseURL + url);
		} else {
			console.warn(e);
			app.$message.error('网络连接超时');
		}
	}
	res = res.data || {};
	if (res.status === 401) {
		source.cancel();
		source = axios.CancelToken.source();
		store.clearSession();
		store.session('returnRoute', window.location.pathname);
		app.$router.push({ name: 'Login' });
		app.$message.error('你的登录信息已失效');
	} else if (res.status !== 200) {
		app.$message.error(res.data || res.message || '服务器异常');
		res = null;
	} else {
		res.message && app.$message.success(res.message);
		if (res.data || res.data === false) {
			res = res.data;
		}
	}
	return res;
}
