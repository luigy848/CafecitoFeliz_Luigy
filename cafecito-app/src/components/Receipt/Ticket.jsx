import "./Ticket.css";
import {
  PAYMENT_LABELS,
  SALE_STATUS_LABELS,
  formatMoney,
  formatDateTime,
} from "../../utils/labels";

export default function Ticket({ sale }) {
  if (!sale) return null;

  return (
    <article className="ticket">
      <header className="ticket-header">
        <img
          className="ticket-logo"
          src="/img/logo.png"
          alt="Cafecito Feliz"
        />
        <p className="ticket-folio">Folio {sale.receiptNumber}</p>
        <p className="ticket-date">{formatDateTime(sale.createdAt)}</p>
      </header>

      <section className="ticket-customer">
        {sale.customer ? (
          <>
            <p>
              Cliente: <strong>{sale.customer.name}</strong>
            </p>
            <p>
              Telefono: {sale.customer.phone} &middot; {sale.customer.code}
            </p>
            <p>Visitas acumuladas: {sale.visitsAtSale}</p>
          </>
        ) : (
          <p className="ticket-no-customer">Venta sin cliente registrado</p>
        )}
      </section>

      <table className="ticket-items">
        <thead>
          <tr>
            <th>Cant</th>
            <th>Producto</th>
            <th>P. unit</th>
            <th>Importe</th>
          </tr>
        </thead>
        <tbody>
          {sale.products.map((item, index) => (
            <tr key={index}>
              <td>{item.quantity}</td>
              <td>{item.name}</td>
              <td>{formatMoney(item.unitPrice)}</td>
              <td>{formatMoney(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="ticket-totals">
        <div className="ticket-row">
          <span>Subtotal</span>
          <span>{formatMoney(sale.subtotal)}</span>
        </div>

        {sale.discount?.percentage > 0 && (
          <div className="ticket-row ticket-row-discount">
            <span>
              {sale.discount.name} ({sale.discount.percentage}%)
            </span>
            <span>-{formatMoney(sale.discount.amount)}</span>
          </div>
        )}

        <div className="ticket-row ticket-row-total">
          <span>TOTAL</span>
          <span>{formatMoney(sale.total)}</span>
        </div>
      </section>

      <footer className="ticket-footer">
        <p>Pago: {PAYMENT_LABELS[sale.paymentType] || sale.paymentType}</p>
        <p>Estado: {SALE_STATUS_LABELS[sale.status] || sale.status}</p>
        <p className="ticket-thanks">Gracias por su compra</p>
      </footer>
    </article>
  );
}
