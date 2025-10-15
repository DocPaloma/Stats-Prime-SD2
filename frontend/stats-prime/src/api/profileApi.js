const API_URL = "http://localhost:8000/api/users";

export const getUserProfile = async (token) => {
  const res = await fetch(`${API_URL}/profile/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener el perfil.");
  return res.json();
};

export const updateUserProfile = async (token, updatedData) => {
  const res = await fetch(`${API_URL}/profile/update/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error("Error al actualizar el perfil.");
  return res.json();
};

export const deleteUserAccount = async (token) => {
  const res = await fetch(`${API_URL}/delete/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al eliminar la cuenta.");
  return res.json();
};