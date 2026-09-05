import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../store/authSlice";
import { fetchCart } from "../store/cartSlice";
import { selectAuthError, selectAuthStatus, selectIsAuthenticated } from "../store/selectors";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  function submit(event) {
    event.preventDefault();
    dispatch(register(form)).then((action) => {
      if (register.fulfilled.match(action)) {
        dispatch(fetchCart());
        navigate("/", { replace: true });
      }
    });
  }

  return (
    <div className="container page-container auth-page">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">Create your account</p>
        <h1>Join ShoppyGlobe</h1>
        <p className="auth-copy">Register to save your cart securely in MongoDB.</p>
        {error && <div className="auth-error">{error}</div>}
        <label>Full name<input required minLength="2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label>
        <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
        <label>Password<input required minLength="8" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" /></label>
        <button className="primary-btn wide-btn" disabled={status === "loading"}>{status === "loading" ? "Creating..." : "Create account"}</button>
        <p className="auth-footer">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
