import axios from 'axios';

const axiosClient = axios.create({
    baseURL: "https://localhost:8000/api/",
    headers: {
        'Content-Type': 'application/json',},
    });

    axiosClient.Interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    export default axiosClient;
    