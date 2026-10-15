import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import ErrorMessage from "../common/ErrorMessage";

const roleIcon = (role) => (role === "admin" ? "\u{1F511}" : "\u{1F6D2}");

export default function LoginForm({ profiles, onSubmit, loading, error }) {
  const [selected, setSelected] = useState(null);
  const [password, setPassword] = useState("");

  const current = selected || profiles[0]?.username;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ username: current, password });
  };

  if (profiles.length === 0) {
    return (
      <p className="login-empty">
        No hay perfiles disponibles. Corre <code>npm run seed:staff</code> en el
        backend.
      </p>
    );
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="role-picker">
        {profiles.map((profile) => (
          <button
            key={profile.username}
            type="button"
            className={
              current === profile.username
                ? "role-option role-option-active"
                : "role-option"
            }
            onClick={() => setSelected(profile.username)}
          >
            <span className="role-icon">{roleIcon(profile.role)}</span>
            <span className="role-label">{profile.name}</span>
          </button>
        ))}
      </div>

      <Input
        label="Contrasena"
        name="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        autoFocus
      />

      <ErrorMessage message={error} />

      <Button type="submit" disabled={loading || password.length === 0}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
