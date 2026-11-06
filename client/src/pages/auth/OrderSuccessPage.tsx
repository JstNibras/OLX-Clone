import { Link, useParams } from "react-router-dom";

const OrderSuccessPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="page-container">
      <div className="order-success-card">
        <div className="success-icon-wrap">✓</div>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-primary)", marginBottom: "0.5rem" }}>
          Order Placed Successfully!
        </h1>

        <p style={{ color: "var(--color-text-secondary)", fontSize: "1rem" }}>
          Thank you for your purchase. The seller has been notified of your order.
        </p>

        {orderId && (
          <div>
            <span className="order-id-badge">Order ID: #{orderId}</span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "300px", margin: "1rem auto 0 auto" }}>
          {orderId && (
            <Link to={`/orders/${orderId}`} className="btn btn-primary btn-lg">
              View Order Details
            </Link>
          )}

          <Link to="/my-orders" className="btn btn-secondary">
            Go to My Orders
          </Link>

          <Link to="/products" className="btn btn-outline btn-sm">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
