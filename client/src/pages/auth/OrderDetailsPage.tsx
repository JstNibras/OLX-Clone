import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchOrderById } from "../../features/orders/ordersSlice";

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

  if (!id) return <p>Invalid order ID</p>;
  if (detailsLoading) return <p>Loading order details...</p>;
  if (detailsError) return <p>{detailsError}</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div>
      <h1>Order Details</h1>

      <p>
        <strong>Order ID:</strong> {order._id}
      </p>

      <p>
        <strong>Date:</strong>{" "}
        {new Date(order.createdAt).toLocaleString("en-IN")}
      </p>

      <p>
        <strong>Status:</strong> {order.status}
      </p>

      <h2>Items</h2>

      {order.items.map((item) => (
        <div key={item.productId}>
          {item.image && (
            <img src={item.image} alt={item.title} width="120" />
          )}

          <h3>{item.title}</h3>

          <p>₹{item.price.toLocaleString("en-IN")}</p>
        </div>
      ))}

      <hr />

      <h2>Total: ₹{order.totalAmount.toLocaleString("en-IN")}</h2>

      <Link to="/my-orders">Back to My Orders</Link>
    </div>
  );
};

export default OrderDetailsPage;