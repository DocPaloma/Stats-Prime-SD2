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

  // 🔄 Recuperación por correo
  forgotPassword: (email) =>
    publicApi.post("users/password-reset-email/", { email }),

  // ✅ Confirmar nueva contraseña con token
  resetPasswordConfirm: (token, password) =>
    publicApi.post("users/password-reset-confirm/", { token, password }),

  // 🧩 Alternativa: pregunta secreta (si la usas)
  resetPasswordBySecret: (username, secret_answer, new_password) =>
    publicApi.post("users/password-reset-secret/", {
      username,
      secret_answer,
      new_password,
    }),
};

export default authApi;
