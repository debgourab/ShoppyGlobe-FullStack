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
      <section className="auth-shell">
        <aside className="auth-aside">
          <div className="brand-mini">ShoppyGlobe</div>
          <div className="auth-aside-copy">
            <p className="eyebrow">Join the store</p>
            <h2>Create one account for a smoother shopping journey.</h2>
            <p>Your secure account keeps your cart synced and gives you access to the complete shopping flow.</p>
            <div className="auth-benefits">
              <div className="auth-benefit"><span className="auth-check">✓</span><span>Secure JWT authentication</span></div>
              <div className="auth-benefit"><span className="auth-check">✓</span><span>Cart saved to your account</span></div>
              <div className="auth-benefit"><span className="auth-check">✓</span><span>Quick access across your sessions</span></div>
            </div>
          </div>
        </aside>

        <div className="auth-form-wrap">
          <form className="auth-card" onSubmit={submit}>
            <p className="eyebrow">Create account</p>
            <h1>Join ShoppyGlobe</h1>
            <p className="auth-copy">Create your account in a few seconds and start building your cart.</p>
            {error && <div className="auth-error">{error}</div>}
            <label>Full name<input required minLength="2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" /></label>
            <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
            <label>Password<input required minLength="8" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" /></label>
            <button className="primary-btn wide-btn" disabled={status === "loading"}>{status === "loading" ? "Creating account..." : "Create secure account"}</button>
            <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
          </form>
        </div>
      </section>
    </div>
  );
}
