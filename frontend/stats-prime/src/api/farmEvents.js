import axiosClient from "./axiosClient";

export const getFarmEvents = async (gameIdDB) => {
    const response = await axios.get(`${API_BASE_URL}/games/${gameIdDB}/farm-events/`, {
        headers: {
            ...authHeaders(),
        },
    });
    return response.data;

};

export const createFarmEvent = async (gameIdDB, eventData) => {
    const response = await axios.post(`${API_BASE_URL}/games/${gameIdDB}/farm-events/`, eventData, {
        headers: {
            ...authHeaders(),
        },
    });
    return response.data;
};

const deleteFarmEvent = async (gameIdDB, eventId) => {
    const response = await axios.delete(`${API_BASE_URL}/games/${gameIdDB}/farm-events/${eventId}/`, {
        headers: {
            ...authHeaders(),
        },
    });
    return response.data;
};