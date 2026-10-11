import ProductCard from "../ProductCard";
import "./ProductGrid.css";

export default function ProductGrid({ products, onAdd }) {
  if (products.length === 0) {
    return <p className="product-grid-empty">No hay productos que mostrar</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
