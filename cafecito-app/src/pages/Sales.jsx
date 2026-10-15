import "./Sales.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as saleService from "../services/saleService";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import {
  PAYMENT_LABELS,
  SALE_STATUS_LABELS,
  formatMoney,
  formatDateTime,
} from "../utils/labels";

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [onlyToday, setOnlyToday] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSales = async () => {
    setLoading(true);
    setError(null);

    try {
      const filters = onlyToday ? { from: startOfToday() } : {};
      const data = await saleService.getSales(filters);
      setSales(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las ventas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, [onlyToday]);

  const summary = useMemo(() => {
    const valid = sales.filter((sale) => sale.status !== "cancelled");

    return {
      count: valid.length,
      total: valid.reduce((sum, sale) => sum + sale.total, 0),
      discounts: valid.reduce((sum, sale) => sum + sale.discount.amount, 0),
    };
  }, [sales]);

  const handleCancel = async (sale) => {
    const confirmed = window.confirm(
      "Cancelar la venta " + sale.receiptNumber + " por " + formatMoney(sale.total) + "?",
    );
    if (!confirmed) return;

    try {
      await saleService.cancelSale(sale._id);
      loadSales();
    } catch (err) {
      setError(err.message || "No se pudo cancelar la venta");
    }
  };

  if (loading) return <Loading text="Cargando ventas..." />;

  return (
    <section className="sales-page">
      <header className="sales-header">
        <h1>Ventas</h1>
        <div className="sales-filters">
          <Button
            variant={onlyToday ? "primary" : "ghost"}
            size="sm"
            onClick={() => setOnlyToday(true)}
          >
            Hoy
          </Button>
          <Button
            variant={onlyToday ? "ghost" : "primary"}
            size="sm"
            onClick={() => setOnlyToday(false)}
          >
            Todas
          </Button>
        </div>
      </header>

      <div className="sales-summary">
        <div className="summary-card">
          <span className="summary-label">Ventas</span>
          <strong className="summary-value">{summary.count}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total cobrado</span>
          <strong className="summary-value">{formatMoney(summary.total)}</strong>
        </div>
        <div className="summary-card">
          <span className="summary-label">Descuentos otorgados</span>
          <strong className="summary-value">
            {formatMoney(summary.discounts)}
          </strong>
        </div>
      </div>

      <ErrorMessage message={error} onRetry={loadSales} />

      {sales.length === 0 ? (
        <p className="sales-empty">Todavia no hay ventas registradas</p>
      ) : (
        <table className="sales-table">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Pago</th>
              <th>Descuento</th>
              <th>Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr
                key={sale._id}
                className={
                  sale.status === "cancelled" ? "sale-row-cancelled" : ""
                }
              >
                <td>{sale.receiptNumber}</td>
                <td>{formatDateTime(sale.createdAt)}</td>
                <td>
                  {sale.customer ? (
                    <>
                      {sale.customer.name}
                      <br />
                      <span className="sales-phone">
                        {sale.customer.phone}
                      </span>
                    </>
                  ) : (
                    <span className="sales-phone">Sin registrar</span>
                  )}
                </td>
                <td>{PAYMENT_LABELS[sale.paymentType] || sale.paymentType}</td>
                <td>
                  {sale.discount.percentage > 0
                    ? sale.discount.percentage + "%"
                    : "-"}
                </td>
                <td>{formatMoney(sale.total)}</td>
                <td>{SALE_STATUS_LABELS[sale.status] || sale.status}</td>
                <td className="sales-actions">
                  <Link to={`/recibo/${sale._id}`} className="sales-link">
                    Ver ticket
                  </Link>
                  {sale.status !== "cancelled" && (
                    <button
                      type="button"
                      className="sales-cancel"
                      onClick={() => handleCancel(sale)}
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
