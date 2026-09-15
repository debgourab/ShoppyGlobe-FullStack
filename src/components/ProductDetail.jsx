import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../store/cartSlice";
import { selectIsAuthenticated } from "../store/selectors";
import { fetchProductById } from "../api/productsApi";
import LazyImage from "./LazyImage";
import Loading from "./Loading";
import ErrorState from "./ErrorState";
import { formatINR } from "../utils/currency";

export default function ProductDetail() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setStatus("loading");
      setError("");

      try {
        const data = await fetchProductById(productId, controller.signal);
        setProduct(data);
        setStatus("success");
      } catch (err) {
        if (err.name === "AbortError") return;
        setStatus("error");
        setError(err.message === "PRODUCT_NOT_FOUND" ? "The requested product does not exist." : err.message || "Unable to load product details.");
      }
    }

    loadProduct();
    return () => controller.abort();
  }, [productId]);

  if (status === "loading") return <Loading fullPage />;

  if (status === "error") {
    return (
      <div className="container page-container">
        <ErrorState message={error} />
        <div className="center-link"><Link to="/">← Back to products</Link></div>
      </div>
    );
  }

  function handleAdd() {
    if (isAuthenticated) dispatch(addToCartAsync({ productId: product.id }));
    else navigate(`/login?redirect=/products/${product.id}`);
  }

  return (
    <div className="container page-container">
      <Link className="back-link" to="/">← Back to collection</Link>

      <section className="detail-card">
        <div className="detail-image-wrap">
          <LazyImage className="detail-image" src={product.image} alt={product.title} />
        </div>

        <div className="detail-info">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.title}</h1>
          <div className="detail-rating">★ {product.rating.toFixed(1)} <span>•</span> {product.ratingCount} verified ratings</div>
          <p className="detail-description">{product.description}</p>

          <div className="detail-price">
            <strong>{formatINR(product.price)}</strong>
            <span>Inclusive of taxes</span>
          </div>

          <div className="detail-meta">
            <div><span>Availability</span><b>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</b></div>
            <div><span>Product ID</span><b>SG-{product.id}</b></div>
            <div><span>Category</span><b>{product.category}</b></div>
            <div><span>Customer ratings</span><b>{product.ratingCount}</b></div>
          </div>

          <div className="detail-trust">
            <div>Secure checkout</div>
            <div>Easy returns</div>
            <div>Fast dispatch</div>
          </div>

          <button className="primary-btn wide-btn" type="button" onClick={handleAdd} disabled={product.stock <= 0}>
            {isAuthenticated ? "Add to cart" : "Login to add to cart"}
          </button>
        </div>
      </section>
    </div>
  );
}
