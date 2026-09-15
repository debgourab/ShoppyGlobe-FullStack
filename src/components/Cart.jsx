import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartItems, selectCartSubtotal, selectIsAuthenticated, selectCartError } from "../store/selectors";
import CartItem from "./CartItem";
import EmptyState from "./EmptyState";
import { formatINR } from "../utils/currency";

export default function Cart() {
  const items = useSelector(selectCartItems);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartError = useSelector(selectCartError);
  const subtotal = useSelector(selectCartSubtotal);
  const navigate = useNavigate();
  const shipping = subtotal > 0 ? (subtotal >= 9000 ? 0 : 499) : 0;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, 9000 - subtotal);

  if (!isAuthenticated) {
    return (
      <div className="container page-container">
        <section className="state-card">
          <div className="state-icon">🔐</div>
          <h2>Login to view your cart</h2>
          <p>Your saved cart is protected and linked securely to your ShoppyGlobe account.</p>
          <Link className="primary-btn" to="/login?redirect=/cart">Login to continue</Link>
        </section>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container page-container">
        <EmptyState title="Your cart is empty" message="Explore the collection and add something you love." />
      </div>
    );
  }

  return (
    <div className="container page-container">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Shopping bag</p>
          <h1>Your Cart</h1>
        </div>
        <Link className="back-link" to="/">Continue shopping →</Link>
      </div>

      {cartError && <div className="auth-error cart-error">{cartError}</div>}

      <div className="cart-layout">
        <section className="cart-list" aria-label="Cart items">
          {items.map((item) => <CartItem key={item.id} item={item} />)}
        </section>

        <aside className="summary-card">
          <h2>Order Summary</h2>
          {remainingForFreeShipping > 0 ? (
            <div className="summary-note">Add {formatINR(remainingForFreeShipping)} more to unlock free shipping.</div>
          ) : (
            <div className="summary-note">You unlocked free shipping on this order.</div>
          )}
          <div className="summary-row"><span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span><b>{formatINR(subtotal)}</b></div>
          <div className="summary-row"><span>Shipping</span><b>{shipping === 0 ? "FREE" : formatINR(shipping)}</b></div>
          <div className="summary-divider" />
          <div className="summary-row total-row"><span>Total</span><b>{formatINR(total)}</b></div>
          <button className="primary-btn wide-btn" type="button" onClick={() => navigate("/checkout")}>
            Proceed to secure checkout
          </button>
          <div className="secure-checkout-note"><span>✓</span><span>Account-protected checkout experience</span></div>
        </aside>
      </div>
    </div>
  );
}