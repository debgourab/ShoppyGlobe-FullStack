import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { fetchCart } from "../store/cartSlice";
import { selectAuthError, selectAuthStatus, selectIsAuthenticated } from "../store/selectors";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [form, setForm] = useState({ email: "", password: "" });

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) navigate(redirect, { replace: true });
  }, [isAuthenticated, navigate, redirect]);

  function submit(event) {
    event.preventDefault();
    dispatch(login(form)).then((action) => {
      if (login.fulfilled.match(action)) {
        dispatch(fetchCart());
        navigate(redirect, { replace: true });
      }
    });
  }

  return (
    <div className="container page-container auth-page">
      <section className="auth-shell">
        <aside className="auth-aside">
          <div className="brand-mini">ShoppyGlobe</div>
          <div className="auth-aside-copy">
            <p className="eyebrow">Welcome back</p>
            <h2>Pick up exactly where you left off.</h2>
            <p>Sign in to access your secure cart, continue shopping and keep your account experience synced.</p>
            <div className="auth-benefits">
              <div className="auth-benefit"><span className="auth-check">✓</span><span>Persistent cart stored securely</span></div>
              <div className="auth-benefit"><span className="auth-check">✓</span><span>Protected account access</span></div>
              <div className="auth-benefit"><span className="auth-check">✓</span><span>Fast, seamless checkout flow</span></div>
            </div>
          </div>
        </aside>

        <div className="auth-form-wrap">
          <form className="auth-card" onSubmit={submit}>
            <p className="eyebrow">Account access</p>
            <h1>Welcome back</h1>
            <p className="auth-copy">Enter your details to continue shopping securely.</p>
            {error && <div className="auth-error">{error}</div>}
            <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
            <label>Password<input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" /></label>
            <button className="primary-btn wide-btn" disabled={status === "loading"}>{status === "loading" ? "Logging in..." : "Login securely"}</button>
            <p className="auth-footer">New to ShoppyGlobe? <Link to="/register">Create an account</Link></p>
          </form>
        </div>
      </section>
    </div>
  );
}
