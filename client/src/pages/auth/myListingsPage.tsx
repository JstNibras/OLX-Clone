import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyListings } from "../../services/productService";
import type { Product } from "../../types/product";

const MyListingsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]  = useState("")

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listings = await getMyListings();
                setProducts(listings);
            } catch (err) {
                console.error(err)
                setError("Failed to load your listings.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchListings();
    }, [])

    if (isLoading) {
        return <p>Loading your listings...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>My Listings</h1>

            {products.length === 0 ? (
                <p>You haven't listed any products yet.</p>
            ) : (
                <div>
                {products.map((product) => (
                    <div key={product._id}>
                    <img
                        src={product.images[0]}
                        alt={product.title}
                        width="150"
                    />

                    <h2>{product.title}</h2>
                    <p>₹{product.price.toLocaleString("en-IN")}</p>
                    <p>Status: {product.status}</p>

                    {product.status === "AVAILABLE" && (
                        <Link to={`/edit-product/${product._id}`}>
                        Edit
                        </Link>
                    )}
                    </div>
                ))}
                </div>
            )}
        </div>
    )
}

export default MyListingsPage;