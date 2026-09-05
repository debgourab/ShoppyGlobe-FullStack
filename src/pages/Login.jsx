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
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">ShoppyGlobe account</p>
        <h1>Welcome back</h1>
        <p className="auth-copy">Login to access your protected cart and continue shopping.</p>
        {error && <div className="auth-error">{error}</div>}
        <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
        <label>Password<input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimum 8 characters" /></label>
        <button className="primary-btn wide-btn" disabled={status === "loading"}>{status === "loading" ? "Logging in..." : "Login"}</button>
        <p className="auth-footer">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </div>
  );
}
