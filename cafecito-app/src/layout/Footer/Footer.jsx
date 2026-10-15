import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <span>Cafecito Feliz &middot; Punto de venta</span>
      <span>{year}</span>
    </footer>
  );
}
