export default function ErrorState({ message, onRetry }) {
  return (
    <section className="state-card error-card" role="alert">
      <div className="state-icon">!</div>
      <h2>Could not load the products</h2>
      <p>{message}</p>
      {onRetry && (
        <button className="primary-btn" type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </section>
  );
}