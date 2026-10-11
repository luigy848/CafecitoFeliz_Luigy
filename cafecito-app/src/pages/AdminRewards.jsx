import "./Admin.css";
import { useEffect, useState } from "react";
import * as loyaltyService from "../services/loyaltyService";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

const emptyForm = {
  name: "",
  description: "",
  minVisits: "",
  percentage: "",
  windowDays: "90",
};

export default function AdminRewards() {
  const [rewards, setRewards] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadRewards = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await loyaltyService.getRewards(true);
      setRewards(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los niveles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewards();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const startEdit = (reward) => {
    setEditingId(reward._id);
    setForm({
      name: reward.name,
      description: reward.description || "",
      minVisits: String(reward.minVisits),
      percentage: String(reward.percentage),
      windowDays: String(reward.windowDays),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      minVisits: Number(form.minVisits),
      percentage: Number(form.percentage),
      windowDays: Number(form.windowDays),
    };

    try {
      if (editingId) {
        await loyaltyService.updateReward(editingId, payload);
      } else {
        await loyaltyService.createReward(payload);
      }

      cancelEdit();
      loadRewards();
    } catch (err) {
      setError(err.message || "No se pudo guardar el nivel");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (reward) => {
    try {
      if (reward.active) {
        await loyaltyService.deactivateReward(reward._id);
      } else {
        await loyaltyService.updateReward(reward._id, { active: true });
      }
      loadRewards();
    } catch (err) {
      setError(err.message || "No se pudo cambiar el nivel");
    }
  };

  if (loading) return <Loading text="Cargando niveles de lealtad..." />;

  return (
    <section className="admin-page">
      <h1>Niveles de lealtad</h1>
      <p className="admin-hint">
        Una visita es un dia distinto con al menos una compra pagada. Si un
        cliente alcanza varios niveles, se aplica el de mayor porcentaje.
      </p>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Editar nivel" : "Nuevo nivel"}</h2>

        <Input
          label="Nombre"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Descripcion"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <Input
          label="Visitas necesarias"
          name="minVisits"
          type="number"
          value={form.minVisits}
          onChange={handleChange}
          required
        />
        <Input
          label="Porcentaje de descuento (maximo 15)"
          name="percentage"
          type="number"
          value={form.percentage}
          onChange={handleChange}
          required
        />
        <Input
          label="Dias de la ventana"
          name="windowDays"
          type="number"
          value={form.windowDays}
          onChange={handleChange}
          required
        />

        <div className="admin-form-actions">
          <Button type="submit" disabled={saving}>
            {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear"}
          </Button>
          {editingId && (
            <Button variant="ghost" onClick={cancelEdit}>
              Cancelar
            </Button>
          )}
        </div>
      </form>

      <ErrorMessage message={error} onRetry={loadRewards} />

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nivel</th>
            <th>Visitas</th>
            <th>Descuento</th>
            <th>Ventana</th>
            <th>Activo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rewards.map((reward) => (
            <tr key={reward._id} className={reward.active ? "" : "row-muted"}>
              <td>
                {reward.name}
                {reward.description && (
                  <>
                    <br />
                    <span className="admin-note">{reward.description}</span>
                  </>
                )}
              </td>
              <td>{reward.minVisits}</td>
              <td>{reward.percentage}%</td>
              <td>{reward.windowDays} dias</td>
              <td>{reward.active ? "Si" : "No"}</td>
              <td className="admin-actions">
                <button
                  type="button"
                  className="admin-link"
                  onClick={() => startEdit(reward)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="admin-link"
                  onClick={() => toggleActive(reward)}
                >
                  {reward.active ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
