import axiosClient from "./axiosClient";

const authApi = {
  // 🔐 Autenticación
  login: (username, password) => axiosClient.post("users/login/", { username, password }),
  register: (data) => axiosClient.post("users/register/", data),
  refreshToken: (refresh) => axiosClient.post("users/token/refresh/", { refresh }),

  // 👤 Perfil
  getProfile: () => axiosClient.get("users/profile/"),

  // 🔄 Recuperación de contraseña por correo
  forgotPassword: (email) =>
    axiosClient.post("users/password-reset-email/", { email }),

  // ✅ Confirmar nueva contraseña usando token
  resetPasswordConfirm: (token, password) =>
    axiosClient.post("users/password-reset-confirm/", { token, password }),

  // 🧩 Alternativa: recuperación por pregunta secreta
  resetPasswordBySecret: (username, secret_answer, new_password) =>
    axiosClient.post("users/password-reset-secret/", {
      username,
      secret_answer,
      new_password,
    }),
};

export default authApi;