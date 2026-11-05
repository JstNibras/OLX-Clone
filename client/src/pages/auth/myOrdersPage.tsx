import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchMyOrders } from "../../features/orders/ordersSlice";

const MyOrdersPage = () => {
  const dispatch = useAppDispatch();

  const { orders, isLoading, error } = useAppSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (isLoading) return <p>Loading orders...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id}>
            <hr />

            <h3>Order ID: {order._id}</h3>

            <p>
              Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}
            </p>

            <p>Status: {order.status}</p>

            <p>
              Total: ₹{order.totalAmount.toLocaleString("en-IN")}
            </p>

            <p>Items: {order.items.length}</p>

            <Link to={`/orders/${order._id}`}>
              View Order Details
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrdersPage;