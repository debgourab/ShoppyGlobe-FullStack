import React, { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, Link, Outlet, ScrollRestoration } from "react-router-dom";
import Header from "./components/Header";
import Loading from "./components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "./store/cartSlice";
import { restoreSession } from "./store/authSlice";
import { selectIsAuthenticated } from "./store/selectors";

const Home = lazy(() => import("./pages/Home"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const Cart = lazy(() => import("./components/Cart"));
const Checkout = lazy(() => import("./components/Checkout"));
const NotFound = lazy(() => import("./components/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link className="footer-logo" to="/">
            <span className="footer-logo-mark">S</span>
            <span>ShoppyGlobe</span>
          </Link>
          <p>A modern full-stack shopping experience built for fast discovery, secure accounts and a clean checkout journey.</p>
        </div>

        <div className="footer-col">
          <h3>Shop</h3>
          <Link to="/">All products</Link>
          <Link to="/">Popular picks</Link>
          <Link to="/">Electronics</Link>
          <Link to="/">Fashion</Link>
        </div>

        <div className="footer-col">
          <h3>Account</h3>
          <Link to="/login">Login</Link>
          <Link to="/register">Create account</Link>
          <Link to="/cart">Your cart</Link>
          <Link to="/checkout">Checkout</Link>
        </div>

        <div className="footer-col">
          <h3>Project</h3>
          <a href="https://github.com/debgourab/ShoppyGlobe-FullStack" target="_blank" rel="noreferrer">GitHub repository</a>
          <a href="https://github.com/debgourab" target="_blank" rel="noreferrer">Developer profile</a>
          <span>Built by Deb Gourab Biswas</span>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} ShoppyGlobe. All rights reserved.</span>
        <span>React · Redux Toolkit · Node.js · Express · MongoDB</span>
      </div>
    </footer>
  );
}

function AppLayout() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(restoreSession());
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="app-shell">
      <Header />
      <main className="main-content">
        <Suspense fallback={<Loading fullPage />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "products/:productId", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <NotFound /> }
    ]
  }
]);

export default AppLayout;