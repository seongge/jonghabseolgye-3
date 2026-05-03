import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token.replace('Bearer ', '').trim()}`;
  }
  return config;
});

export default instance;
