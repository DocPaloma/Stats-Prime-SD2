import axiosClient from "./axiosClient";
import publicApi from "./publicApi";

const authApi = {
  // 🔐 Autenticación
  login: (username, password) => publicApi.post("users/login/", { username, password }),
  register: (data) => publicApi.post("users/register/", data),
  refreshToken: (refresh) => publicApi.post("users/token/refresh/", { refresh }),

  // 👤 Perfil
  getProfile: () => axiosClient.get("users/profile/"),

  // 🔄 Recuperación de contraseña por correo
  forgotPassword: (email) =>
    publicApi.post("users/password-reset-email/", { email }),

  // ✅ Confirmar nueva contraseña usando token
  resetPasswordConfirm: (token, password) =>
    publicApi.post("users/password-reset-confirm/", { token, password }),

  // 🧩 Alternativa: recuperación por pregunta secreta
  resetPasswordBySecret: (username, secret_answer, new_password) =>
    publicApi.post("users/password-reset-secret/", {
      username,
      secret_answer,
      new_password,
    }),
};

export default authApi;