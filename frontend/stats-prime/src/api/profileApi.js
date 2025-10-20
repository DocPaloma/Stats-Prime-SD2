import axiosClient from "./axiosClient";

export const getUserProfile = async () => {
  const res = await axiosClient.get("users/profile/");
  return res.data;
};

export const updateUserProfile = async (updatedData) => {
  // Puede incluir: username, first_name, last_name, secret_question, secret_answer
  const res = await axiosClient.put("users/profile/", updatedData);
  return res.data;
};

export const deleteUserAccount = async (password) => {
  const res = await axiosClient.delete("users/profile/", { data: { password } });
  return res.data;
};
