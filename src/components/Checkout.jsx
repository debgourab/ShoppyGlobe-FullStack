import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCartRemote } from "../store/cartSlice";
import { selectCartItems, selectCartSubtotal, selectIsAuthenticated } from "../store/selectors";
import { formatINR } from "../utils/currency";

export default function Checkout() {
  const items = useSelector(selectCartItems);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const subtotal = useSelector(selectCartSubtotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", postalCode: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login?redirect=/checkout", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!items.length && !submitted) navigate("/cart", { replace: true });
  }, [items.length, navigate, submitted]);

  const shipping = subtotal >= 9000 ? 0 : 499;
  const total = subtotal + shipping;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    dispatch(clearCartRemote());
    setTimeout(() => navigate("/", { replace: true }), 1600);
  }

  if (submitted) {
    return (
      <div className="container page-container">
        <section className="success-card">
          <div className="success-icon">✓</div>
          <h1>Order placed successfully</h1>
          <p>Your order has been received. You’ll be redirected to the storefront in a moment.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="container page-container">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Secure checkout</p>
          <h1>Complete your order</h1>
        </div>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Delivery information</h2>
          <p className="auth-copy">Enter the details we need to prepare your order.</p>

          <div className="form-grid">
            <label>Full name<input required name="name" value={form.name} onChange={handleChange} placeholder="Deb Gourab Biswas" /></label>
            <label>Email address<input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" /></label>
            <label>Phone number<input required name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" /></label>
            <label>City<input required name="city" value={form.city} onChange={handleChange} placeholder="Kolkata" /></label>
            <label className="full-field">Delivery address<input required name="address" value={form.address} onChange={handleChange} placeholder="Street, building and area" /></label>
            <label>Postal code<input required name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="700001" /></label>
          </div>

          <button className="primary-btn wide-btn" type="submit">Place order securely</button>
          <div className="secure-checkout-note"><span>✓</span><span>Your checkout is protected by your authenticated account session.</span></div>
        </form>

        <aside className="summary-card">
          <h2>Your order</h2>
          {items.map((item) => (
            <div className="checkout-item" key={item.id}>
              <span>{item.title} × {item.quantity}</span>
              <b>{formatINR(item.price * item.quantity)}</b>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row"><span>Subtotal</span><b>{formatINR(subtotal)}</b></div>
          <div className="summary-row"><span>Shipping</span><b>{shipping === 0 ? "FREE" : formatINR(shipping)}</b></div>
          <div className="summary-row total-row"><span>Total</span><b>{formatINR(total)}</b></div>
          <div className="summary-note">No payment details are stored in this portfolio demo.</div>
        </aside>
      </div>
    </div>
  );
}