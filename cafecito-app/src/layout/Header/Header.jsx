import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navigation from "../Navigation/Navigation";
import Button from "../../components/common/Button";
import "./Header.css";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!isAuthenticated) return null;

  const roleLabel = user.role === "admin" ? "Administrador" : "Cajero";

  return (
    <header className="header">
      <Link to="/" className="header-brand">
        <img className="header-logo" src="/img/logo.png" alt="Cafecito Feliz" />
        <span className="header-title">Cafecito Feliz</span>
      </Link>

      <Navigation />

      <div className="header-user">
        <span className="header-name">{user.name}</span>
        <span className="header-role">{roleLabel}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Salir
        </Button>
      </div>
    </header>
  );
}
