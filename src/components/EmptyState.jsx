import { Link } from "react-router-dom";

export default function EmptyState({ title, message, action = true }) {
  return (
    <section className="state-card">
      <div className="state-icon">🛍️</div>
      <h2>{title}</h2>
      <p>{message}</p>
      {action && <Link className="primary-btn" to="/">Continue shopping</Link>}
    </section>
  );
}