const axios = require('axios');
const service = axios.create({
  // baseURL: 'http://saatana.cn/shop-api/',
  baseURL: 'http://localhost:8080/api/',
  timeout: 10000
});
function getToken() {
  return localStorage.token || sessionStorage.token || '';
}
service.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
service.interceptors.request.use(
  config => {
    config.headers.token = getToken();
    console.info('request info: ', config.baseURL + config.url, config.data);
    return config;
  },
  function(error) {
    console.info('request error', error);
    return Promise.reject(error);
  }
);
export async function Get(url, data) {
  return Request(url, data, 'get');
}
export async function Post(url, data) {
  return Request(url, data);
}
export async function Request(url, data, method) {
  method = (method || 'post').toUpperCase();
  let res = {};
  let body = method === 'POST' ? { url, data, method } : { url, params: data, method };
  try {
    res = await service(body);
  } catch (e) {
    console.warn(e);
    app.$Message.error('网络连接异常');
  }
  res = res.data || {};
  if (res.status && res.status !== 200) {
    app.$Message.error(res.data || res.message);
    if (res.status === 401) {
      sessionStorage.clear();
      localStorage.clear();
      app.$router.push('/login');
    }
    res = {};
  }
  return res.data;
}
