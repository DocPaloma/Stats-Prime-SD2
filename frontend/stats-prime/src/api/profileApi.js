import axios from "axios";
import axiosClient from "./axiosClient";


export const getUserProfile = async (token) => {
  const res = await axiosClient.get("/users/profile/");
  return res.data;
};

export const updateUserProfile = async (token, updatedData) => {
  
};

export const deleteUserAccount = async (token) => {
  const res = await axiosClient.delete("/users/profile/delete/");
  return res.data;
};