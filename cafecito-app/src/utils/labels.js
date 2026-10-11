export const PAYMENT_LABELS = {
  cash: "Efectivo",
  credit_card: "Tarjeta de credito",
  debit_card: "Tarjeta de debito",
  bank_transfer: "Transferencia",
};

export const PAYMENT_STATUS_LABELS = {
  pending: "Pendiente",
  paid: "Pagado",
  failed: "Fallido",
  refunded: "Devuelto",
};

export const SALE_STATUS_LABELS = {
  pending: "Pendiente",
  preparing: "Preparando",
  ready: "Listo",
  delivered: "Entregado",
  cancelled: "Cancelada",
};

export const formatMoney = (amount) => "$" + Number(amount).toFixed(2);

export const formatDateTime = (value) =>
  new Date(value).toLocaleString("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  });
