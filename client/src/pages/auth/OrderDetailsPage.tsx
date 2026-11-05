import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getOrderById } from "../../services/orderService";
import type { Order } from "../../types/order";

const OrderDetailsPage = () => {
    const { id } = useParams<{ id: string}>();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) {
                setError("Invalid order ID");
                setLoading(false);
                return
            }

            try {
                const data = await getOrderById(id);
                setOrder(data)
            } catch (err: any) {
                setError(err.response?.data?.message || "FAiled to load order")
            } finally {
                setLoading(false)
            }
        }

        fetchOrder();
    }, [id])

    if (loading) return <p>Loading order details...</p>;
    if (error) return <p>{error}</p>
    if(!order) return <p>Prder not found</p>

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
                    <img
                    src={item.image}
                    alt={item.title}
                    width="120"
                    />
                )}

                <h3>{item.title}</h3>

                <p>
                    ₹{item.price.toLocaleString("en-IN")}
                </p>
                </div>
            ))}

            <hr />

            <h2>
                Total: ₹{order.totalAmount.toLocaleString("en-IN")}
            </h2>

            <Link to="/my-orders">Back to My Orders</Link>
        </div>
    )
}

export default OrderDetailsPage;