// src/api/farmEvents.js
import axiosClient from "./axiosClient";

export const getGames = async () => {
  const response = await axiosClient.get("games/");
  return response.data;
};

export const getFarmEvents = async (gameIdDB) => {
  const response = await axiosClient.get(`games/${gameIdDB}/farm-events/`);
  return response.data;
};

export const createFarmEvent = async (gameIdDB, eventData) => {
  const response = await axiosClient.post(`games/${gameIdDB}/farm-events/`, eventData);
  return response.data;
};

export const deleteFarmEvent = async (gameIdDB, eventId) => {
  const response = await axiosClient.delete(`games/${gameIdDB}/farm-events/${eventId}/`);
  return response.data;
};

export const getSources = async (gameIdDB) => {
  const response = await axiosClient.get(`games/${gameIdDB}/sources/`);
  return response.data;
};

export const getItems = async (gameIdDB) => {
  const response = await axiosClient.get(`games/${gameIdDB}/items/`);
  return response.data;
};