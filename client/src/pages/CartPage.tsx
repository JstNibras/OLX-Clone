import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchCart, removeCartProduct } from "../features/cart/cartSlice";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60";

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

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Shopping Cart</h1>
          <p className="page-subtitle">
            {products.length} {products.length === 1 ? "item" : "items"} ready for checkout
          </p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2 className="empty-state-title">Your cart is empty</h2>
          <p className="empty-state-desc">
            Explore hundreds of verified pre-owned items and add them to your cart.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Left Column: List of items */}
          <div className="cart-items-list">
            {products.map((product) => (
              <div key={product._id} className="cart-item-card">
                <img
                  src={
                    product.images && product.images[0]
                      ? product.images[0]
                      : FALLBACK_IMAGE
                  }
                  alt={product.title}
                  className="cart-item-img"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />

                <div className="cart-item-details">
                  <span className="badge badge-category" style={{ marginBottom: "0.25rem" }}>
                    {product.category}
                  </span>

                  <Link to={`/products/${product._id}`}>
                    <h3 className="cart-item-title">{product.title}</h3>
                  </Link>

                  <div className="cart-item-price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </div>
                </div>

                <button
                  className="btn btn-danger-outline btn-sm"
                  onClick={() => handleRemove(product._id)}
                  disabled={removingId === product._id}
                >
                  {removingId === product._id ? "Removing..." : "Remove"}
                </button>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <div className="order-summary-card">
              <h2 className="order-summary-title">Order Summary</h2>

              <div className="summary-row">
                <span>Items ({products.length})</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>

              <div className="summary-row">
                <span>Delivery & Platform Fee</span>
                <span style={{ color: "var(--color-success)", fontWeight: 600 }}>Free</span>
              </div>

              <div className="summary-total-row">
                <span>Total Amount</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>

              <Link to="/checkout" style={{ display: "block", marginTop: "1.5rem" }}>
                <button className="btn btn-primary btn-block btn-lg">
                  Proceed to Checkout
                </button>
              </Link>

              <Link
                to="/products"
                className="btn btn-secondary btn-block btn-sm"
                style={{ marginTop: "0.75rem" }}
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
