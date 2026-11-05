import { Link, useParams } from "react-router-dom";

const OrderSuccessPage = () => {
    const { orderId } = useParams<{ orderId: string }>();

    return (
        <div>
            <h1>Order Placed Successfully!</h1>

            <p>Your order has been confirmed.</p>

            <p>
                <strong>Order ID :</strong> {orderId}
            </p>

            <p>You can view your order details in My Orders.</p>

            <Link to="/products">
                Continue Shopping
            </Link>
        </div>
    )
}

export default OrderSuccessPage;