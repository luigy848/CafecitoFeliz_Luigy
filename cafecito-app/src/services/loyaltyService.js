import apiClient from "./apiClient";

const getRewards = async (includeInactive = false) => {
  const response = await apiClient.get("/loyalty-rewards", {
    params: includeInactive ? { includeInactive: true } : {},
  });
  return response.data;
};

const createReward = async (data) => {
  const response = await apiClient.post("/loyalty-rewards", data);
  return response.data;
};

const updateReward = async (rewardId, data) => {
  const response = await apiClient.put(`/loyalty-rewards/${rewardId}`, data);
  return response.data;
};

const deactivateReward = async (rewardId) => {
  const response = await apiClient.delete(`/loyalty-rewards/${rewardId}`);
  return response.data;
};

export { getRewards, createReward, updateReward, deactivateReward };
