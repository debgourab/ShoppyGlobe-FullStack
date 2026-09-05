import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../store/cartSlice";
import { selectIsAuthenticated } from "../store/selectors";
import LazyImage from "./LazyImage";
import { convertToINR, formatINR } from "../utils/currency";

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

  return (
    <article className="product-card">
      <Link className="product-image-wrap" to={`/products/${product.id}`}>
        <LazyImage className="product-image" src={product.thumbnail} alt={product.title} />
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
          <strong>{formatINR(convertToINR(product.price))}</strong>
          <button className="add-btn" type="button" onClick={handleAdd}>
            {isAuthenticated ? "Add to Cart" : "Login to Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
