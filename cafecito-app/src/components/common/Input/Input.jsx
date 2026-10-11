import "./Input.css";

export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  maxLength,
  autoFocus = false,
  className = "",
}) {
  return (
    <label className={["field", className].filter(Boolean).join(" ")}>
      {label && <span className="field-label">{label}</span>}
      <input
        className="field-input"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        autoFocus={autoFocus}
      />
    </label>
  );
}
