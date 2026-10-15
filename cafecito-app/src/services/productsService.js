import apiClient from "./apiClient";

const getProducts = async () => {
  const response = await apiClient.get("/products", {
    params: { limit: 100 },
  });
  return response.data;
};

const searchProducts = async (params) => {
  const response = await apiClient.get("/products/search", { params });
  return response.data;
};

const getProductById = async (productId) => {
  const response = await apiClient.get(`/products/${productId}`);
  return response.data;
};

const createProduct = async (data) => {
  const response = await apiClient.post("/products", data);
  return response.data;
};

const updateProduct = async (productId, data) => {
  const response = await apiClient.put(`/products/${productId}`, data);
  return response.data;
};

const deleteProduct = async (productId) => {
  await apiClient.delete(`/products/${productId}`);
};

export {
  getProducts,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
