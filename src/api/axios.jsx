import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000', // 백엔드 서버 주소
    timeout: 5000,
});

// 모든 요청에 자동으로 토큰을 포함시키는 설정입니다.
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;