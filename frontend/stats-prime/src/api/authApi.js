import axiosClient from "./axiosClient";
import publicApi from "./publicApi";

const authApi = {
  // 🔐 Autenticación (todas bajo /api/users/)
  login: (username, password) =>
    publicApi.post("users/login/", { username, password }),

  register: (data) =>
    publicApi.post("users/register/", data),

  refreshToken: (refresh) =>
    publicApi.post("users/token/refresh/", { refresh }),

  // 👤 Perfil (requiere token – usa axiosClient)
  getProfile: () =>
    axiosClient.get("users/profile/"),

  getSecretQuestion: (username) =>
    publicApi.get(`users/secret-question/?username=${username}`),

  // 🧩 Alternativa: pregunta secreta (si la usas)
  resetPasswordBySecret: (username, secret_answer, new_password) =>
    publicApi.post("users/password-reset-secret/", {
      username,
      secret_answer,
      new_password,
    }),
};

export default authApi;
