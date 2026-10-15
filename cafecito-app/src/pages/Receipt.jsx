import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as saleService from "../services/saleService";
import Ticket from "../components/Receipt";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import "./Receipt.css";

export default function Receipt() {
  const { saleId } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSale = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await saleService.getSaleById(saleId);
      setSale(data);
    } catch (err) {
      setError(err.message || "No se pudo cargar el recibo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSale();
  }, [saleId]);

  if (loading) return <Loading text="Cargando el recibo..." />;

  return (
    <section className="receipt-page">
      <ErrorMessage message={error} onRetry={loadSale} />

      <Ticket sale={sale} />

      <div className="receipt-actions">
        <Button>Imprimir</Button>
        <Button variant="ghost" onClick={() => navigate("/")}>
          Nueva venta
        </Button>
        <Button variant="ghost" onClick={() => navigate("/ventas")}>
          Ver ventas
        </Button>
      </div>
    </section>
  );
}
