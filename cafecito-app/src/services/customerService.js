import apiClient from "./apiClient";

const searchByPhone = async (phone) => {
  const response = await apiClient.get("/customers/search", {
    params: { phone },
  });
  return response.data;
};

const getCustomers = async (withBenefits = false) => {
  const response = await apiClient.get("/customers", {
    params: withBenefits ? { withBenefits: true } : {},
  });
  return response.data;
};

const getCustomerById = async (customerId) => {
  const response = await apiClient.get(`/customers/${customerId}`);
  return response.data;
};

const getCustomerBenefits = async (customerId) => {
  const response = await apiClient.get(`/customers/${customerId}/benefits`);
  return response.data;
};

const getCustomerSales = async (customerId) => {
  const response = await apiClient.get(`/customers/${customerId}/sales`);
  return response.data;
};

const createCustomer = async (data) => {
  const payload = {
    phone: data.phone?.replaceAll(" ", ""),
    name: data.name?.trim(),
    birthDate: data.birthDate || undefined,
  };

  const response = await apiClient.post("/customers", payload);
  return response.data;
};

const updateCustomer = async (customerId, data) => {
  const response = await apiClient.put(`/customers/${customerId}`, data);
  return response.data;
};

export {
  searchByPhone,
  getCustomers,
  getCustomerById,
  getCustomerBenefits,
  getCustomerSales,
  createCustomer,
  updateCustomer,
};
