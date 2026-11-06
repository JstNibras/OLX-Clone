import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchMyOrders } from "../features/orders/ordersSlice";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=60";

const MyOrdersPage = () => {
  const dispatch = useAppDispatch();

  const { orders, isLoading, error } = useAppSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">Review your past purchases and delivery history</p>
        </div>

        <Link to="/products" className="btn btn-secondary btn-sm">
          Browse More Ads
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h2 className="empty-state-title">No orders placed yet</h2>
          <p className="empty-state-desc">
            You haven't bought any items yet. Discover top bargains on electronics, cars, and more.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <span className="order-id-label">Order #{order._id}</span>
                  <span style={{ marginLeft: "0.75rem", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <span className="badge badge-success">{order.status}</span>
              </div>

              <div className="order-details-grid">
                <div className="order-meta-item">
                  <span className="order-meta-label">Total Amount</span>
                  <span className="order-meta-value" style={{ color: "var(--color-primary)", fontWeight: 800 }}>
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="order-meta-item">
                  <span className="order-meta-label">Total Items</span>
                  <span className="order-meta-value">{order.items.length} {order.items.length === 1 ? "Product" : "Products"}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {order.items.map((item, idx) => (
                  <div
                    key={`${order._id}-${idx}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.35rem 0.65rem",
                      backgroundColor: "var(--color-bg)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.title}
                      style={{ width: "32px", height: "26px", objectFit: "cover", borderRadius: "3px" }}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">
                  View Full Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
