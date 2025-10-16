import axios from "axios";

const publicApi = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
});

publicApi.interceptors.request.use((config) => {
  console.log("📤 Enviando a:", config.baseURL + config.url);
  console.log("📦 Data:", config.data);
  return config;
});

export default publicApi;