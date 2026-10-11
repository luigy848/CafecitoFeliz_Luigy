import "./Loading.css";

export default function Loading({ text = "Cargando..." }) {
  return <p className="loading">{text}</p>;
}
