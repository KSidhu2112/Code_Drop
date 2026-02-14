import axios from 'axios';

export const FRONTEND_URL = window.location.origin;

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://code-drop-g4h1.onrender.com/api',
});

export default api;
