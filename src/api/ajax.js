const axios = require('axios');
const service = axios.create({
  // baseURL: 'http://saatana.cn/shop-api/',
  baseURL: 'http://localhost:8080/api/',
  timeout: 5000
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
export async function Post(url, data) {
  let res = {};
  try {
    res = await service({ url, data, method: 'post' });
  } catch (e) {
    console.warn(e);
    alert('网络连接异常');
  }
  res = res.data || {};
  if (res.status && res.status !== 200) {
    alert(res.data || res.message);
    if (res.status === 401) {
      app.$router.push('/login');
    }
    res = {};
  }
  return res.data;
}
