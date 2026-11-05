import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyOrders } from "../../services/orderService";
import type { Order } from "../../types/order";

const MyOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getMyOrders();
                setOrders(data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load orders");
            } finally {
                setLoading(false)
            }
        }

        fetchOrders();
    }, []);

    if(loading) return <p>Loading orders....</p>

    if (error) return <p>{error}</p>

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
                    Date:{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>

                    <p>
                    Status: {order.status}
                    </p>

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
    )
}

export default MyOrdersPage;