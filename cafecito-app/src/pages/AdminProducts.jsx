import "./Admin.css";
import { useEffect, useState } from "react";
import * as productsService from "../services/productsService";
import * as categoryService from "../services/categoryService";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatMoney } from "../utils/labels";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageURL: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [productsData, categoriesData] = await Promise.all([
        productsService.searchProducts({ limit: 100 }),
        categoryService.getCategories(),
      ]);

      setProducts(productsData.products);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      category: product.category?._id || "",
      imageURL: product.imageURL || "",
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
      price: Number(form.price),
      category: form.category,
      imageURL: form.imageURL.trim() || undefined,
    };

    try {
      if (editingId) {
        await productsService.updateProduct(editingId, payload);
      } else {
        await productsService.createProduct(payload);
      }

      cancelEdit();
      loadData();
    } catch (err) {
      setError(err.message || "No se pudo guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailable = async (product) => {
    try {
      await productsService.updateProduct(product._id, {
        available: !product.available,
      });
      loadData();
    } catch (err) {
      setError(err.message || "No se pudo cambiar la disponibilidad");
    }
  };

  if (loading) return <Loading text="Cargando productos..." />;

  return (
    <section className="admin-page">
      <h1>Productos</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2>

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
          label="Precio"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />

        <label className="field">
          <span className="field-label">Categoria</span>
          <select
            className="field-input"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Elige una categoria</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <Input
          label="Direccion de la imagen"
          name="imageURL"
          value={form.imageURL}
          onChange={handleChange}
          placeholder="https://..."
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

      <ErrorMessage message={error} onRetry={loadData} />

      <table className="admin-table">
        <thead>
          <tr>
            <th></th>
            <th>Producto</th>
            <th>Categoria</th>
            <th>Precio</th>
            <th>Disponible</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <img
                  className="admin-thumb"
                  src={product.imageURL}
                  alt={product.name}
                  loading="lazy"
                />
              </td>
              <td>{product.name}</td>
              <td>{product.category?.name}</td>
              <td>{formatMoney(product.price)}</td>
              <td>{product.available ? "Si" : "No"}</td>
              <td className="admin-actions">
                <button
                  type="button"
                  className="admin-link"
                  onClick={() => startEdit(product)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="admin-link"
                  onClick={() => toggleAvailable(product)}
                >
                  {product.available ? "Marcar agotado" : "Marcar disponible"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
