import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as authService from "../services/authService";
import LoginForm from "../components/LoginForm";
import Loading from "../components/common/Loading";
import "./Login.css";

const errorMessage = (err) => {
  if (err.status === 400 || err.status === 401) return "Contrasena invalida";
  if (err.status === 403) return "Este perfil esta desactivado";
  if (err.kind === "VALIDATION") return "Revisa los datos e intenta de nuevo";
  if (err.kind === "NETWORK" || err.kind === "TIMEOUT") {
    return "No se pudo conectar con el servidor";
  }
  return "No se pudo iniciar sesion";
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const destination = location.state?.from || "/";

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const data = await authService.getProfiles();
        setProfiles(data);
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoadingProfiles(false);
      }
    };

    loadProfiles();
  }, []);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const loggedUser = await login(credentials);

      const allowed =
        !destination.startsWith("/admin") || loggedUser.role === "admin";

      navigate(allowed ? destination : "/", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login">
      <div className="login-card">
        <img className="login-logo" src="/img/logo.png" alt="Cafecito Feliz" />
        <p className="login-subtitle">Elige tu perfil para entrar</p>

        {loadingProfiles ? (
          <Loading text="Cargando perfiles..." />
        ) : (
          <LoginForm
            profiles={profiles}
            onSubmit={handleLogin}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </section>
  );
}
