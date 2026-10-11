import apiClient from "./apiClient";

const getMe = async () => {
  const response = await apiClient.get("/users/me");
  return response.data;
};

const getUsers = async (role) => {
  const response = await apiClient.get("/users", { params: { role } });
  return response.data;
};

const createUser = async (data) => {
  const response = await apiClient.post("/users", data);
  return response.data;
};

const updateUser = async (userId, data) => {
  const response = await apiClient.put(`/users/${userId}`, data);
  return response.data;
};

export { getMe, getUsers, createUser, updateUser };
