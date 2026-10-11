import { useState } from "react";
import { useCart } from "../../context/CartContext";
import * as customerService from "../../services/customerService";
import Button from "../common/Button";
import Input from "../common/Input";
import ErrorMessage from "../common/ErrorMessage";
import "./CustomerPanel.css";

export default function CustomerPanel() {
  const { customer, benefits, selectCustomer, clearSale } = useCart();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", birthDate: "" });

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setShowForm(false);

    try {
      const data = await customerService.searchByPhone(phone);
      selectCustomer(data.customer, data);
    } catch (err) {
      if (err.kind === "NOT_FOUND") {
        setError("Ese telefono no esta registrado. Registra al cliente:");
        setShowForm(true);
      } else if (err.kind === "VALIDATION") {
        setError("El telefono debe tener 10 digitos");
      } else {
        setError(err.message || "No se pudo buscar al cliente");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const created = await customerService.createCustomer({
        phone,
        name: newCustomer.name,
        birthDate: newCustomer.birthDate || undefined,
      });

      const data = await customerService.getCustomerBenefits(created._id);
      selectCustomer(data.customer, data);

      setShowForm(false);
      setNewCustomer({ name: "", birthDate: "" });
    } catch (err) {
      setError(err.message || "No se pudo registrar al cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCustomer = () => {
    clearSale();
    setPhone("");
    setError(null);
    setShowForm(false);
  };

  if (customer) {
    return (
      <section className="customer-panel customer-panel-found">
        <div className="customer-data">
          <strong className="customer-name">{customer.name}</strong>
          <span className="customer-phone">{customer.phone}</span>
          <span className="customer-code">{customer.code}</span>
        </div>

        <div className="customer-benefits">
          <span className="customer-visits">
            {benefits.visits} visitas en el trimestre
          </span>

          {benefits.currentReward ? (
            <span className="customer-reward">
              {benefits.currentReward.name}: {benefits.currentReward.percentage}%
              de descuento
            </span>
          ) : (
            <span className="customer-no-reward">Sin descuento todavia</span>
          )}

          {benefits.nextReward && (
            <span className="customer-next">
              Faltan {benefits.nextReward.visitsToGo} visitas para{" "}
              {benefits.nextReward.name} ({benefits.nextReward.percentage}%)
            </span>
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={handleChangeCustomer}>
          Cambiar cliente
        </Button>
      </section>
    );
  }

  return (
    <section className="customer-panel">
      <p className="customer-optional">
        El telefono es opcional. Sin el, la venta se cobra igual pero no
        acumula visita ni recibe descuento.
      </p>

      <form className="customer-search" onSubmit={handleSearch}>
        <Input
          label="Telefono del cliente (opcional)"
          name="phone"
          value={phone}
          onChange={(event) =>
            setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
          }
          placeholder="10 digitos"
          maxLength={10}
          autoFocus
        />
        <Button type="submit" disabled={loading || phone.length < 10}>
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </form>

      <ErrorMessage message={error} />

      {showForm && (
        <form className="customer-create" onSubmit={handleCreate}>
          <Input
            label="Nombre"
            name="name"
            value={newCustomer.name}
            onChange={(event) =>
              setNewCustomer((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            required
          />
          <Input
            label="Fecha de nacimiento (opcional)"
            name="birthDate"
            type="date"
            value={newCustomer.birthDate}
            onChange={(event) =>
              setNewCustomer((current) => ({
                ...current,
                birthDate: event.target.value,
              }))
            }
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar cliente"}
          </Button>
        </form>
      )}
    </section>
  );
}
