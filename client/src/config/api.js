import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://code-drop-g4h1.onrender.com/api',
});

export default api;
