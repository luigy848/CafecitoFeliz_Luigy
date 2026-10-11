import apiClient from "./apiClient";

const getPaymentMethods = async (customerId) => {
  const response = await apiClient.get("/payment-methods", {
    params: { customerId },
  });
  return response.data;
};

const createPaymentMethod = async (customerId, data) => {
  const payload = {
    customerId,
    type: data.type,
    cardNumber: data.cardNumber?.replaceAll(" ", "") || undefined,
    cardHolderName: data.cardHolderName?.trim() || undefined,
    expiryDate: data.expiryDate?.trim() || undefined,
    cvv: data.cvv || undefined,
    isDefault: data.isDefault || false,
  };

  const response = await apiClient.post("/payment-methods", payload);
  return response.data;
};

const deletePaymentMethod = async (methodId) => {
  await apiClient.delete(`/payment-methods/${methodId}`);
};

export { getPaymentMethods, createPaymentMethod, deletePaymentMethod };
