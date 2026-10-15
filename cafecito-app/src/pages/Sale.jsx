import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import * as productsService from "../services/productsService";
import * as categoryService from "../services/categoryService";
import * as saleService from "../services/saleService";
import CategoryTabs from "../components/CategoryTabs";
import ProductGrid from "../components/ProductGrid";
import CustomerPanel from "../components/CustomerPanel";
import CartView from "../components/Cart";
import Input from "../components/common/Input";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import "./Sale.css";

const PAYMENT_TYPES = [
  { value: "cash", label: "Efectivo" },
  { value: "credit_card", label: "Tarjeta de credito" },
  { value: "debit_card", label: "Tarjeta de debito" },
  { value: "bank_transfer", label: "Transferencia" },
];

export default function Sale() {
  const navigate = useNavigate();
  const { customer, items, itemsForApi, addProduct, clearSale } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [charging, setCharging] = useState(false);

  const loadMenu = async () => {
    setLoading(true);
    setError(null);

    try {
      const [productsData, categoriesData] = await Promise.all([
        productsService.getProducts(),
        categoryService.getCategories(),
      ]);

      setProducts(productsData.products);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "No se pudo cargar el menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const visibleProducts = useMemo(() => {
    const text = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category?._id === selectedCategory;
      const matchesSearch =
        text === "" || product.name.toLowerCase().includes(text);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  const handleCheckout = async () => {
    setCharging(true);
    setError(null);

    try {
      const sale = await saleService.createSale({
        customerId: customer?._id,
        items: itemsForApi,
        paymentType,
      });

      clearSale();
      navigate(`/recibo/${sale._id}`);
    } catch (err) {
      setError(err.message || "No se pudo completar la venta");
    } finally {
      setCharging(false);
    }
  };

  const checkoutLabel = charging
    ? "Cobrando..."
    : customer
      ? "Cobrar"
      : "Cobrar sin registrar cliente";

  if (loading) return <Loading text="Cargando el menu..." />;

  return (
    <section className="sale">
      <div className="sale-menu">
        <div className="sale-toolbar">
          <CategoryTabs
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <Input
            name="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar producto"
            className="sale-search"
          />
        </div>

        <ErrorMessage message={error} onRetry={loadMenu} />

        <ProductGrid products={visibleProducts} onAdd={addProduct} />
      </div>

      <div className="sale-side">
        <CustomerPanel />

        <div className="payment-type">
          <span className="payment-type-label">Forma de pago</span>
          <div className="payment-type-options">
            {PAYMENT_TYPES.map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  paymentType === option.value
                    ? "payment-option payment-option-active"
                    : "payment-option"
                }
                onClick={() => setPaymentType(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <CartView
          onCheckout={handleCheckout}
          checkoutLabel={checkoutLabel}
          disabled={items.length === 0 || charging}
        />
      </div>
    </section>
  );
}
