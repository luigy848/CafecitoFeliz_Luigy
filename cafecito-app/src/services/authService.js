import apiClient from "./apiClient";

const getProfiles = async () => {
  const response = await apiClient.get("/auth/profiles");
  return response.data;
};

const login = async (credentials) => {
  const payload = {
    username: credentials.username?.trim().toLowerCase(),
    password: credentials.password,
  };

  const response = await apiClient.post("/auth/login", payload);

  return {
    token: response.data.token,
    refreshToken: response.data.refreshToken,
    user: response.data.user,
  };
};

export { getProfiles, login };
