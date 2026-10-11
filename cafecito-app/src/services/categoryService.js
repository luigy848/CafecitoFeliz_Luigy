import apiClient from "./apiClient";

const getCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data;
};

const getCategoryById = async (categoryId) => {
  const response = await apiClient.get(`/categories/${categoryId}`);
  return response.data;
};

const getProductsByCategory = async (categoryId) => {
  const response = await apiClient.get(`/categories/${categoryId}/products`);
  return response.data;
};

export { getCategories, getCategoryById, getProductsByCategory };
