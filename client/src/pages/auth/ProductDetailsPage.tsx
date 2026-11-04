import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/productService";
import type { Product } from "../../types/product";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <h1>{product.title}</h1>

      {product.images.length > 0 && (
        <img
          src={product.images[0]}
          alt={product.title}
          width="300"
        />
      )}

      <h2>₹{product.price}</h2>

      <p>{product.description}</p>

      <p>
        <strong>Category:</strong> {product.category}
      </p>

      <p>
        <strong>Seller ID:</strong> {product.sellerId}
      </p>

      <p>
        <strong>Status:</strong> {product.status}
      </p>
    </div>
  );
};

export default ProductDetailsPage;