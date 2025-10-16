import axiosClient from "./axiosClient";

const authApi = {
  // 🔐 Autenticación
  login: (username, password) => axiosClient.post("login/", { username, password }),
  register: (data) => axiosClient.post("register/", data),
  refreshToken: (refresh) => axiosClient.post("token/refresh/", { refresh }),

  // 👤 Perfil
  getProfile: () => axiosClient.get("profile/"),

  // 🔄 Recuperación de contraseña por correo
  forgotPassword: (email) =>
    axiosClient.post("password-reset-email/", { email }),

  // ✅ Confirmar nueva contraseña usando token
  resetPasswordConfirm: (token, password) =>
    axiosClient.post("password-reset-confirm/", { token, password }),

  // 🧩 Alternativa: recuperación por pregunta secreta
  resetPasswordBySecret: (username, secret_answer, new_password) =>
    axiosClient.post("password-reset-secret/", {
      username,
      secret_answer,
      new_password,
    }),
};

export default authApi;