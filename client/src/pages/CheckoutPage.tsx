import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchCart, checkoutOrder } from "../features/cart/cartSlice";

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
    return (
      <div className="page-container">
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Preparing your checkout...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2 className="empty-state-title">Your cart is empty</h2>
          <p className="empty-state-desc">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Link to="/products" className="btn btn-primary btn-sm">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Order Checkout</h1>
          <p className="page-subtitle">Review items and finalize your order</p>
        </div>
      </div>

      {checkoutError && <div className="alert alert-danger">{checkoutError}</div>}

      <div className="checkout-layout">
        {/* Left Column: Items to Purchase */}
        <div>
          <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem", color: "var(--color-primary)" }}>
              Items in Order ({products.length})
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {products.map((product) => (
                <div
                  key={product._id}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid var(--color-divider)",
                  }}
                >
                  <img
                    src={
                      product.images && product.images[0]
                        ? product.images[0]
                        : FALLBACK_IMAGE
                    }
                    alt={product.title}
                    style={{
                      width: "80px",
                      height: "65px",
                      objectFit: "cover",
                      borderRadius: "var(--radius-sm)",
                    }}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <span className="badge badge-category" style={{ fontSize: "0.7rem", marginBottom: "0.2rem" }}>
                      {product.category}
                    </span>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-text-primary)" }}>
                      {product.title}
                    </h3>
                  </div>

                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-primary)" }}>
                    ₹{product.price.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: "1.25rem 1.5rem",
              backgroundColor: "var(--color-primary-light)",
              border: "1px solid #d1e2e6",
            }}
          >
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <span style={{ fontSize: "1.5rem" }}>🛡️</span>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-primary)" }}>
                  Buyer Protection Guaranteed
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                  Direct seller communication, secure order placement, and verified item listings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div>
          <div className="order-summary-card">
            <h2 className="order-summary-title">Payment Summary</h2>

            <div className="summary-row">
              <span>Item Total ({products.length})</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-row">
              <span>Platform Fee</span>
              <span style={{ color: "var(--color-success)", fontWeight: 600 }}>FREE</span>
            </div>

            <div className="summary-row">
              <span>Payment Method</span>
              <span style={{ fontWeight: 600 }}>Pay on Pickup / Delivery</span>
            </div>

            <div className="summary-total-row">
              <span>Total Payable</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>

            <button
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: "1.5rem" }}
              onClick={handleCheckout}
              disabled={checkoutLoading || products.length === 0}
            >
              {checkoutLoading ? "Processing Order..." : "Confirm & Place Order"}
            </button>

            <Link
              to="/cart"
              className="btn btn-secondary btn-block btn-sm"
              style={{ marginTop: "0.75rem" }}
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
