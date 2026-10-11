import apiClient from "./apiClient";

const createSale = async ({ customerId, items, paymentType, paymentMethodId }) => {
  const response = await apiClient.post("/sales", {
    customerId,
    items,
    paymentType,
    paymentMethodId,
  });
  return response.data;
};

const getSales = async (filters) => {
  const response = await apiClient.get("/sales", { params: filters });
  return response.data;
};

const getSaleById = async (saleId) => {
  const response = await apiClient.get(`/sales/${saleId}`);
  return response.data;
};

const updateSaleStatus = async (saleId, status) => {
  const response = await apiClient.put(`/sales/${saleId}/status`, { status });
  return response.data;
};

const cancelSale = async (saleId) => {
  const response = await apiClient.put(`/sales/${saleId}/status`, {
    status: "cancelled",
    paymentStatus: "refunded",
  });
  return response.data;
};

export { createSale, getSales, getSaleById, updateSaleStatus, cancelSale };
