import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCartCount, selectSearchTerm, selectCurrentUser, selectIsAuthenticated } from "../store/selectors";
import { setSearchTerm } from "../store/cartSlice";
import { logout } from "../store/authSlice";

function SearchBar() {
  const dispatch = useDispatch();
  const searchTerm = useSelector(selectSearchTerm);

  return (
    <label className="search-box" aria-label="Search products">
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input
        value={searchTerm}
        onChange={(event) => dispatch(setSearchTerm(event.target.value))}
        placeholder="search products..."
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

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/" aria-label="ShoppyGlobe home">
          <span className="brand-mark">S</span>
          <span>Shoppy<span>Globe</span></span>
        </Link>

        <SearchBar />

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          <NavLink to="/cart" className="cart-link">
            <span aria-hidden="true">🛒</span><span>Cart</span><span className="cart-badge">{cartCount}</span>
          </NavLink>

          {isAuthenticated ? (
            <div className="account-area">
              <span className="account-name">Hi, {user?.name?.split(" ")[0]}</span>
              <button className="logout-btn" type="button" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-links">
              <NavLink to="/login" className="nav-link">Login</NavLink>
              <NavLink to="/register" className="auth-nav-btn">Register</NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
