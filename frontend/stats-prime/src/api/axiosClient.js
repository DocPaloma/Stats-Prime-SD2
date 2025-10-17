import axios from 'axios';

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    });

    
axiosClient.interceptors.request.use(
    (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("No autorizado, redirigiendo al login...");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

export default axiosClient;
    