import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCart,
  removeCartProduct,
} from "../../features/cart/cartSlice";

const CartPage = () => {
  const dispatch = useAppDispatch();

  const { products, isLoading, error, removingId } = useAppSelector(
    (state) => state.cart
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (productId: string) => {
    dispatch(removeCartProduct(productId));
  };

  const totalPrice = products.reduce(
    (total, product) => total + product.price,
    0
  );

  if (isLoading) return <p>Loading cart...</p>;

  if (error && products.length === 0) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>My Cart</h1>

      {error && <p>{error}</p>}

      {products.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {products.map((product) => (
            <div key={product._id}>
              <Link to={`/products/${product._id}`}>
                {product.images.length > 0 && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    width="150"
                  />
                )}

                <h3>{product.title}</h3>
              </Link>

              <p>₹{product.price.toLocaleString("en-IN")}</p>

              <button
                onClick={() => handleRemove(product._id)}
                disabled={removingId === product._id}
              >
                {removingId === product._id ? "Removing..." : "Remove"}
              </button>
            </div>
          ))}

          <hr />

          <h2>Total: ₹{totalPrice.toLocaleString("en-IN")}</h2>

          <Link to="/checkout">
            <button>Proceed to Checkout</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default CartPage;