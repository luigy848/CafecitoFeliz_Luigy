import "./ErrorMessage.css";

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="error-message">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="error-retry" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}
