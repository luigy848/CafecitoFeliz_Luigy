import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navigation.css";

const linkClass = ({ isActive }) =>
  isActive ? "nav-link nav-link-active" : "nav-link";

export default function Navigation() {
  const { isAdmin } = useAuth();

  return (
    <nav className="navigation">
      <NavLink to="/" className={linkClass} end>
        Caja
      </NavLink>
      <NavLink to="/clientes" className={linkClass}>
        Clientes
      </NavLink>
      <NavLink to="/ventas" className={linkClass}>
        Ventas
      </NavLink>

      {isAdmin && (
        <>
          <NavLink to="/admin/productos" className={linkClass}>
            Productos
          </NavLink>
          <NavLink to="/admin/lealtad" className={linkClass}>
            Lealtad
          </NavLink>
          <NavLink to="/admin/cuentas" className={linkClass}>
            Cuentas
          </NavLink>
        </>
      )}
    </nav>
  );
}
