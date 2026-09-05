import { useDispatch } from "react-redux";
import { decrementQuantity, incrementQuantity, removeFromCart } from "../store/cartSlice";
import LazyImage from "./LazyImage";
import { formatINR } from "../utils/currency";

export default function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <article className="cart-item">
      <LazyImage className="cart-item-image" src={item.thumbnail} alt={item.title} />
      <div className="cart-item-info">
        <h3>{item.title}</h3>
        <p>{formatINR(item.price)} each</p>
      </div>

      <div className="quantity-control" aria-label={`Quantity for ${item.title}`}>
        <button type="button" onClick={() => dispatch(decrementQuantity(item))} disabled={item.quantity <= 1}>−</button>
        <span>{item.quantity}</span>
        <button type="button" onClick={() => dispatch(incrementQuantity(item))} disabled={item.quantity >= item.stock}>+</button>
      </div>

      <strong className="cart-line-total">{formatINR(item.price * item.quantity)}</strong>

      <button className="remove-btn" type="button" onClick={() => dispatch(removeFromCart(item.id))}>
        Remove
      </button>
    </article>
  );
}
