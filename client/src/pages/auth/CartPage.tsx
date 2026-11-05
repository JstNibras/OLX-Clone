import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart, removeFromCart } from "../../services/cartService";
import type { Product } from "../../types/product";

const CartPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState<string | null>(null)

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError("")

            const cartProducts = await getCart();
            setProducts(cartProducts);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load cart")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemove = async (productId: string) => {
        try {
            setRemovingId(productId);

            await removeFromCart(productId);

            setProducts((currentProducts) => currentProducts.filter((product) => product._id !== productId))
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to remove product");
        } finally {
            setRemovingId(null);
        }
    }

    const totalPrice = products.reduce(
        (total, product) => total + product.price, 0
    )

    if(loading) return <p>Loading cart...</p>;
    if(error && products.length === 0) return <p>{error}</p>

    return (
        <div>
            <h1>My Cart</h1>

            {error && <p>{error}</p>}

            {products.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                {products.map((product) => (
                    <div key={product._id}>
                    <Link to={`/products/${product._id}`}>
                        {product.images.length > 0 && (
                        <img
                            src={product.images[0]}
                            alt={product.title}
                            width="150"
                        />
                        )}

                        <h3>{product.title}</h3>
                    </Link>

                    <p>₹{product.price.toLocaleString("en-IN")}</p>

                    <button
                        onClick={() => handleRemove(product._id)}
                        disabled={removingId === product._id}
                    >
                        {removingId === product._id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                    </div>
                ))}

                <hr />

                <h2>
                    Total: ₹{totalPrice.toLocaleString("en-IN")}
                </h2>

                <Link to="/checkout">
                    <button>Proceed to Checkout</button>
                </Link>
                </>
            )}
        </div>
    )
}

export default CartPage;