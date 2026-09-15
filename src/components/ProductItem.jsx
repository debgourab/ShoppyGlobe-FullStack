import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../store/cartSlice";
import { selectIsAuthenticated } from "../store/selectors";
import LazyImage from "./LazyImage";
import { formatINR } from "../utils/currency";

export default function ProductItem({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  function handleAdd() {
    if (!isAuthenticated) {
      navigate("/login?redirect=/");
      return;
    }
    dispatch(addToCartAsync({ productId: product.id }));
  }

  const badge = product.rating >= 4.6 ? "Top rated" : product.rating >= 4.4 ? "Popular" : "New pick";

  return (
    <article className="product-card">
      <Link className="product-image-wrap" to={`/products/${product.id}`} aria-label={`View ${product.title}`}>
        <span className="product-badge">{badge}</span>
        <LazyImage className="product-image" src={product.thumbnail} alt={product.title} />
        <span className="product-quick-link">View details →</span>
      </Link>

      <div className="product-body">
        <p className="product-category">{product.category}</p>
        <Link to={`/products/${product.id}`}><h3 className="product-title">{product.title}</h3></Link>

        <div className="rating-row">
          <span>★ {product.rating.toFixed(1)}</span>
          <span className="stock-dot">●</span>
          <span>{product.ratingCount} ratings</span>
        </div>

        <div className="price-row">
          <strong>{formatINR(product.price)}</strong>
          <button className="add-btn" type="button" onClick={handleAdd}>
            {isAuthenticated ? "Add to cart" : "Login to add"}
          </button>
        </div>
        <div className="stock-label">{product.stock > 5 ? "In stock · Ready to ship" : `Only ${product.stock} left in stock`}</div>
      </div>
    </article>
  );
}
