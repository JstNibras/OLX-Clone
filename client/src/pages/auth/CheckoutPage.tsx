import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCart,
  checkoutOrder,
} from "../../features/cart/cartSlice";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    products,
    isLoading,
    error,
    checkoutLoading,
    checkoutError,
  } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const totalAmount = products.reduce(
    (total, product) => total + product.price,
    0
  );

  const handleCheckout = async () => {
    try {
      const order = await dispatch(checkoutOrder()).unwrap();

      navigate(`/order-success/${order._id}`, { replace: true });
    } catch {

    }
  };

  if (isLoading) {
    return <p>Loading checkout...</p>;
  }

  if (error && products.length === 0) {
    return <p>{error}</p>;
  }

  if (products.length === 0) {
    return (
      <div>
        <h1>Your cart is empty</h1>
        <Link to="/products">Browse products</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Checkout</h1>

      {checkoutError && <p>{checkoutError}</p>}

      <h2>Order Summary</h2>

      {products.map((product) => (
        <div key={product._id}>
          <h3>{product.title}</h3>

          {product.images.length > 0 && (
            <img
              src={product.images[0]}
              alt={product.title}
              width="100"
            />
          )}

          <p>₹{product.price.toLocaleString("en-IN")}</p>
        </div>
      ))}

      <hr />

      <h2>Total: ₹{totalAmount.toLocaleString("en-IN")}</h2>

      <button
        onClick={handleCheckout}
        disabled={checkoutLoading || products.length === 0}
      >
        {checkoutLoading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default CheckoutPage;