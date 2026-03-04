import axios from 'axios';

export const FRONTEND_URL = window.location.origin;

const isProduction = !window.location.hostname.includes('localhost');
const API_URL = import.meta.env.VITE_API_URL
    || (isProduction ? 'https://code-drop-1.onrender.com/api' : 'http://localhost:5000/api');

const api = axios.create({
    baseURL: API_URL,
});

// Attach token from localStorage on every request
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auto-logout on 401 (expired / invalid token)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('userInfo');
        }
        return Promise.reject(error);
    }
);

export default api;
