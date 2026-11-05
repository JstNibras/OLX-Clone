import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { getCart } from "../../services/cartService";
import { checkout } from "../../services/orderService";
import type { Product } from "../../types/product";

const CheckoutPage = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cartProducts = await getCart();
                setProducts(cartProducts);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load checkout")
            } finally {
                setLoading(false)
            }
        }

        fetchCart();
    }, []);

    const totalAmount = products.reduce((total, product) => total + product.price, 0);

    const handleCheckout = async () => {
        try {
            setProcessing(true);
            setError("");

            await checkout();

            navigate("/order-success", { replace: true })
        } catch (err: any) {
            setError(err.response?.data?.message || "Checkout failed")
        } finally {
            setProcessing(false)
        }
    }

    if (products.length === 0) {
        return (
            <div>
                <h1>Your cart is empty</h1>
                <Link to="/products">Browse products</Link>
            </div>
        )
    }

    return (
        <div>
            <h1>Checkout</h1>

            {error && <p>{error}</p>}

            <h2>Order Summary</h2>

            {products.map((product) => (
                <div key={product._id}>
                <h3>{product.title}</h3>

                {product.images.length > 0 && (
                    <img
                    src={product.images[0]}
                    alt={product.title}
                    width="100"
                    />
                )}

                <p>₹{product.price.toLocaleString("en-IN")}</p>
                </div>
            ))}

            <hr />

            <h2>
                Total: ₹{totalAmount.toLocaleString("en-IN")}
            </h2>

            <button
                onClick={handleCheckout}
                disabled={processing || products.length === 0}
            >
                {processing ? "Processing..." : "Place Order"}
            </button>
        </div>
    )
}

export default CheckoutPage;