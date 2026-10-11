import "./ProductCard.css";

export default function ProductCard({ product, onAdd }) {
  return (
    <button
      type="button"
      className="product-card"
      onClick={() => onAdd(product)}
      title={product.description}
    >
      <img
        className="product-image"
        src={product.imageURL}
        alt={product.name}
        loading="lazy"
      />
      <span className="product-name">{product.name}</span>
      <span className="product-price">${product.price.toFixed(2)}</span>
    </button>
  );
}
