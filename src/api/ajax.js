const axios = require('axios');
let source = axios.CancelToken.source();
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
    config.cancelToken = source.token;
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
    if (axios.isCancel(e)) {
      console.log('请求已取消：' + service.defaults.baseURL + url);
    } else {
      console.warn(e);
      app.$Message.error('网络连接异常');
      source.cancel();
      source = axios.CancelToken.source();
    }
  }
  res = res.data || {};
  if (res.status && res.status !== 200) {
    app.$Message.error(res.message || '发生未知错误,请联系管理员');
    if (res.status === 401) {
      source.cancel();
      source = axios.CancelToken.source();
      sessionStorage.clear();
      localStorage.clear();
      app.$router.push('/login');
    }
    res = {};
  }
  return res.data || {};
}
