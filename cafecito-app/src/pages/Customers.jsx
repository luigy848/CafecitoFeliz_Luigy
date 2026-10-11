import "./Admin.css";
import { useEffect, useMemo, useState } from "react";
import * as customerService from "../services/customerService";
import Input from "../components/common/Input";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await customerService.getCustomers(true);
      setCustomers(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const visibles = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (text === "") return customers;

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(text) ||
        customer.phone.includes(text) ||
        customer.code.toLowerCase().includes(text),
    );
  }, [customers, search]);

  if (loading) return <Loading text="Cargando clientes..." />;

  return (
    <section className="admin-page">
      <h1>Clientes</h1>
      <p className="admin-hint">
        {customers.length} clientes registrados. El nivel se calcula con las
        visitas de los ultimos 90 dias y se actualiza solo.
      </p>

      <Input
        name="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar por nombre, telefono o codigo"
        className="customers-search"
      />

      <ErrorMessage message={error} onRetry={loadCustomers} />

      {visibles.length === 0 ? (
        <p className="sales-empty">No hay clientes que coincidan</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Nombre</th>
              <th>Telefono</th>
              <th>Visitas</th>
              <th>Nivel</th>
              <th>Siguiente nivel</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.code}</td>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.visits}</td>
                <td>
                  {customer.currentReward ? (
                    <span className="customer-level">
                      {customer.currentReward.name} (
                      {customer.currentReward.percentage}%)
                    </span>
                  ) : (
                    <span className="admin-note">Sin descuento</span>
                  )}
                </td>
                <td className="admin-note">
                  {customer.nextReward
                    ? `Faltan ${customer.nextReward.visitsToGo} para ${customer.nextReward.name}`
                    : "Nivel maximo"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
