import axios from 'axios';
import Cookies from 'js-cookie';

// 创建一个Axios实例
const instance = axios.create({
  baseURL: '', 
  withCredentials: true // 允许跨域携带cookie
});

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    if (!config.url.includes('/login')) {
        const token = JSON.parse(sessionStorage.getItem('userInfo')).token;
        if (token) {
          config.headers['token'] = `${token}`;
        }
      }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器（可选）
// instance.interceptors.response.use(
//   response => {
//     return response;
//   },
//   error => {
//     if (error.response && error.response.status === 401) {
//       // Token过期或未授权，重定向到登录页面
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default instance;
