import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCartCount, selectSearchTerm, selectCurrentUser, selectIsAuthenticated } from "../store/selectors";
import { setSearchTerm } from "../store/cartSlice";
import { logout } from "../store/authSlice";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M3 4h2l2.1 9.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 7H6" />
      <circle cx="9" cy="19" r="1.4" />
      <circle cx="18" cy="19" r="1.4" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {open ? <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
    </svg>
  );
}

function SearchBar() {
  const dispatch = useDispatch();
  const searchTerm = useSelector(selectSearchTerm);

  return (
    <label className="search-box" aria-label="Search products">
      <span className="search-icon" aria-hidden="true"><SearchIcon /></span>
      <input
        value={searchTerm}
        onChange={(event) => dispatch(setSearchTerm(event.target.value))}
        placeholder="Search products, categories and more"
        type="search"
      />
    </label>
  );
}

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    dispatch(logout());
    setMenuOpen(false);
    navigate("/");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <div className="promo-bar">
        <div className="container promo-inner">
          <span><strong>Free shipping</strong> on orders over ₹9,000</span>
          <div className="promo-meta"><span>Secure payments</span><span>Easy returns</span><span>Support 7 days a week</span></div>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label="ShoppyGlobe home" onClick={closeMenu}>
            <span className="brand-mark">S</span>
            <span>Shoppy<span>Globe</span></span>
          </Link>

          <SearchBar />

          <nav className="nav-links" aria-label="Main navigation">
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            <NavLink to="/cart" className="cart-link">
              <CartIcon /><span>Cart</span><span className="cart-badge">{cartCount}</span>
            </NavLink>

            {isAuthenticated ? (
              <div className="account-area">
                <span className="account-name">Hi, {user?.name?.split(" ")[0]}</span>
                <button className="logout-btn" type="button" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <div className="auth-links">
                <NavLink to="/login" className="nav-link">Login</NavLink>
                <NavLink to="/register" className="auth-nav-btn">Create account</NavLink>
              </div>
            )}
          </nav>

          <button
            className="mobile-menu-btn"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <MenuIcon open={menuOpen} />
          </button>

          <nav className="mobile-nav" aria-label="Mobile navigation" hidden={!menuOpen}>
            <Link to="/" onClick={closeMenu}>Home</Link>
            <Link to="/cart" onClick={closeMenu}>Cart ({cartCount})</Link>
            {isAuthenticated ? (
              <button type="button" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>Login</Link>
                <Link to="/register" onClick={closeMenu}>Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
