import { Link, useRouteError } from "react-router-dom";

export default function NotFound() {
  let routerError = null;

  try {
    routerError = useRouteError();
  } catch {
    routerError = null;
  }

  const isRouteError = Boolean(routerError);
  const status = routerError?.status || 404;
  const statusText = routerError?.statusText || "Page Not Found";

  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <p className="eyebrow">ShoppyGlobe error</p>
        <div className="error-code">{status}</div>
        <h1>{statusText}</h1>
        <p>
          {isRouteError && routerError?.data
            ? String(routerError.data)
            : "The page or resource you requested could not be found."}
        </p>
        <div className="error-details">
          <span><b>Status:</b> {status}</span>
          <span><b>Requested route:</b> {window.location.pathname}</span>
        </div>
        <Link className="primary-btn" to="/">Return to Home</Link>
      </div>
    </main>
  );
}