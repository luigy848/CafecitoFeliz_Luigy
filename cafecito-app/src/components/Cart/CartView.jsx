import { useCart } from "../../context/CartContext";
import Button from "../common/Button";
import "./CartView.css";

export default function CartView({ onCheckout, checkoutLabel, disabled }) {
  const {
    items,
    subtotal,
    percentage,
    discountAmount,
    total,
    totalItems,
    updateQuantity,
    removeProduct,
  } = useCart();

  if (items.length === 0) {
    return (
      <aside className="cart cart-empty">
        <h2 className="cart-title">Venta en curso</h2>
        <p>Toca un producto del menu para empezar</p>
      </aside>
    );
  }

  return (
    <aside className="cart">
      <h2 className="cart-title">Venta en curso</h2>

      <ul className="cart-items">
        {items.map((item) => (
          <li key={item.product._id} className="cart-item">
            <span className="cart-item-name">{item.product.name}</span>

            <div className="cart-item-quantity">
              <button
                type="button"
                className="qty-btn"
                onClick={() =>
                  updateQuantity(item.product._id, item.quantity - 1)
                }
                disabled={item.quantity === 1}
              >
                &minus;
              </button>
              <span className="qty-value">{item.quantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() =>
                  updateQuantity(item.product._id, item.quantity + 1)
                }
              >
                +
              </button>
            </div>

            <span className="cart-item-subtotal">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>

            <button
              type="button"
              className="cart-item-remove"
              onClick={() => removeProduct(item.product._id)}
              title="Quitar"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-totals">
        <div className="cart-row">
          <span>Articulos</span>
          <span>{totalItems}</span>
        </div>
        <div className="cart-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {percentage > 0 && (
          <div className="cart-row cart-row-discount">
            <span>Descuento por lealtad ({percentage}%)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="cart-row cart-row-total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Button onClick={onCheckout} disabled={disabled}>
        {checkoutLabel}
      </Button>
    </aside>
  );
}
