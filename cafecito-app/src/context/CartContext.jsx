import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [benefits, setBenefits] = useState(null);
  const [items, setItems] = useState([]);

  const addProduct = (product, quantity = 1) => {
    setItems((current) => {
      const found = current.find((item) => item.product._id === product._id);

      if (found) {
        return current.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...current, { product, quantity }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setItems((current) =>
      current.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const removeProduct = (productId) => {
    setItems((current) =>
      current.filter((item) => item.product._id !== productId),
    );
  };

  const selectCustomer = (foundCustomer, customerBenefits) => {
    setCustomer(foundCustomer);
    setBenefits(customerBenefits);
  };

  const clearSale = () => {
    setItems([]);
    setCustomer(null);
    setBenefits(null);
  };

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );

  const percentage = benefits?.currentReward?.percentage ?? 0;

  const discountAmount = useMemo(
    () => Math.round(((subtotal * percentage) / 100) * 100) / 100,
    [subtotal, percentage],
  );

  const total = Math.round((subtotal - discountAmount) * 100) / 100;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const itemsForApi = items.map((item) => ({
    productId: item.product._id,
    quantity: item.quantity,
  }));

  const value = {
    customer,
    benefits,
    items,
    subtotal,
    percentage,
    discountAmount,
    total,
    totalItems,
    itemsForApi,
    addProduct,
    updateQuantity,
    removeProduct,
    selectCustomer,
    clearSale,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return ctx;
}
