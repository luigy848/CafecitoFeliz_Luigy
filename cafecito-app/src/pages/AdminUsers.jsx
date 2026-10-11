import "./Admin.css";
import { useEffect, useState } from "react";
import * as userService from "../services/userService";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

const emptyForm = {
  name: "",
  password: "",
  role: "cashier",
};

export default function AdminUsers() {
  const { user, refreshUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las cuentas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const startEdit = (account) => {
    setEditingId(account._id);
    setForm({
      name: account.name,
      password: "",
      role: account.role,
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

    try {
      if (editingId) {
        const payload = { name: form.name.trim(), role: form.role };
        if (form.password) payload.password = form.password;
        await userService.updateUser(editingId, payload);

        if (editingId === user.id) {
          await refreshUser();
        }
      } else {
        await userService.createUser({
          name: form.name.trim(),
          password: form.password,
          role: form.role,
        });
      }

      cancelEdit();
      loadUsers();
    } catch (err) {
      setError(err.message || "No se pudo guardar la cuenta");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (account) => {
    try {
      await userService.updateUser(account._id, { active: !account.active });
      loadUsers();
    } catch (err) {
      setError(err.message || "No se pudo cambiar la cuenta");
    }
  };

  if (loading) return <Loading text="Cargando cuentas..." />;

  return (
    <section className="admin-page">
      <h1>Cuentas del personal</h1>
      <p className="admin-hint">
        Los clientes no tienen cuenta. Cada perfil que crees aqui aparece como un
        boton en la pantalla de acceso.
      </p>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Editar cuenta" : "Nueva cuenta"}</h2>

        <Input
          label="Nombre"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          label={
            editingId ? "Nueva contrasena (opcional)" : "Contrasena (minimo 6)"
          }
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required={!editingId}
        />

        <label className="field">
          <span className="field-label">Rol</span>
          <select
            className="field-input"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="cashier">Cajero</option>
            <option value="admin">Administrador</option>
          </select>
        </label>

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

      <ErrorMessage message={error} onRetry={loadUsers} />

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Activa</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((account) => (
            <tr key={account._id} className={account.active ? "" : "row-muted"}>
              <td>
                {account.name}
                {account._id === user.id && (
                  <span className="admin-note"> (tu cuenta)</span>
                )}
              </td>
              <td>{account.role === "admin" ? "Administrador" : "Cajero"}</td>
              <td>{account.active ? "Si" : "No"}</td>
              <td className="admin-actions">
                <button
                  type="button"
                  className="admin-link"
                  onClick={() => startEdit(account)}
                >
                  Editar
                </button>
                {account._id !== user.id && (
                  <button
                    type="button"
                    className="admin-link"
                    onClick={() => toggleActive(account)}
                  >
                    {account.active ? "Desactivar" : "Activar"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
