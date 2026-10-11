import "./Admin.css";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="not-found">
      <h2>Esta pagina no existe</h2>
      <Link to="/">Volver a la caja</Link>
    </section>
  );
}
