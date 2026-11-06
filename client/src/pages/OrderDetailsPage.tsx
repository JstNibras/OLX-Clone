import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchOrderById } from "../features/orders/ordersSlice";

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { selectedOrder: order, detailsLoading, detailsError } =
    useAppSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [id, dispatch]);

  if (!id) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">Invalid order ID</div>
      </div>
    );
  }

  if (detailsLoading) {
    return (
      <div className="page-container">
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (detailsError) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">{detailsError}</div>
        <Link to="/my-orders" className="btn btn-secondary btn-sm">
          ← Back to My Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h2 className="empty-state-title">Order Not Found</h2>
          <p className="empty-state-desc">The requested order could not be found.</p>
          <Link to="/my-orders" className="btn btn-primary btn-sm">
            ← View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link
        to="/my-orders"
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: "1.5rem" }}
      >
        ← Back to My Orders
      </Link>

      <div className="checkout-layout">
        {/* Left Column: Items purchased */}
        <div>
          <div className="card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                paddingBottom: "1.25rem",
                borderBottom: "1px solid var(--color-divider)",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <h1 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--color-primary)" }}>
                  Order #{order._id}
                </h1>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                  Ordered on {new Date(order.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <span className="badge badge-success" style={{ fontSize: "0.85rem", padding: "0.35rem 0.8rem" }}>
                Status: {order.status}
              </span>
            </div>

            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--color-primary)" }}>
              Items ({order.items.length})
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {order.items.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  style={{
                    display: "flex",
                    gap: "1.25rem",
                    alignItems: "center",
                    paddingBottom: "1.25rem",
                    borderBottom: index < order.items.length - 1 ? "1px solid var(--color-divider)" : "none",
                  }}
                >
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.title}
                    style={{
                      width: "90px",
                      height: "75px",
                      objectFit: "cover",
                      borderRadius: "var(--radius-sm)",
                    }}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "0.25rem" }}>
                      {item.title}
                    </h3>
                  </div>

                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-primary)" }}>
                    ₹{item.price.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Invoice summary */}
        <div>
          <div className="order-summary-card">
            <h2 className="order-summary-title">Payment Breakdown</h2>

            <div className="summary-row">
              <span>Items Total</span>
              <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-row">
              <span>Shipping Fee</span>
              <span style={{ color: "var(--color-success)", fontWeight: 600 }}>Free</span>
            </div>

            <div className="summary-row">
              <span>Payment Mode</span>
              <span style={{ fontWeight: 600 }}>Cash on Delivery</span>
            </div>

            <div className="summary-total-row">
              <span>Grand Total</span>
              <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
            </div>

            <Link to="/products" style={{ display: "block", marginTop: "1.5rem" }}>
              <button className="btn btn-secondary btn-block">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
