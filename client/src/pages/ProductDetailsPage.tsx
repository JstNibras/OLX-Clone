import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import type { Product } from "../types/product";
import { addProductToCart } from "../features/cart/cartSlice";
import { getProductById } from "../services/productService";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60";

const ProductDetailsPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [cartMessage, setCartMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const addingToCart = useAppSelector((state) => state.cart.isAdding);

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

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setCartMessage("");
      await dispatch(addProductToCart(product._id)).unwrap();
      setCartMessage("Product added to cart successfully!");
    } catch (err) {
      setCartMessage(
        typeof err === "string" ? err : "Failed to add product to cart"
      );
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h2 className="empty-state-title">Product Not Found</h2>
          <p className="empty-state-desc">
            {error || "The product you're looking for does not exist or has been removed."}
          </p>
          <Link to="/products" className="btn btn-primary btn-sm">
            ← Browse Other Products
          </Link>
        </div>
      </div>
    );
  }

  const mainImage =
    product.images && product.images.length > 0 ? product.images[0] : FALLBACK_IMAGE;

  return (
    <div className="page-container">
      <Link
        to="/products"
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: "1.5rem" }}
      >
        ← Back to All Ads
      </Link>

      {cartMessage && (
        <div className="alert alert-success">
          <span>{cartMessage}</span>
          <button
            onClick={() => setCartMessage("")}
            style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      <div className="product-details-layout">
        {/* Left Column: Image & Description */}
        <div>
          <div className="product-details-gallery">
            <img
              src={mainImage}
              alt={product.title}
              className="product-details-main-img"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
          </div>

          <div className="product-details-description-card">
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--color-primary)" }}>
              Description
            </h2>
            <p style={{ whiteSpace: "pre-line", lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
              {product.description}
            </p>
          </div>
        </div>

        {/* Right Column: Pricing & Action Card & Seller */}
        <div className="product-details-sidebar">
          <div className="product-details-main-card">
            <div className="product-details-price">
              ₹{product.price.toLocaleString("en-IN")}
            </div>

            <h1 className="product-details-title">{product.title}</h1>

            <div className="product-meta-row">
              <span className="badge badge-category">{product.category}</span>
              <span
                className={`badge ${
                  product.status === "AVAILABLE" ? "badge-success" : "badge-danger"
                }`}
              >
                {product.status}
              </span>
            </div>

            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={handleAddToCart}
              disabled={addingToCart || product.status !== "AVAILABLE"}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>

          <div className="seller-info-card">
            <div className="seller-info-header">
              <div className="seller-avatar">👤</div>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-primary)" }}>
                  Seller Information
                </h3>
                <span className="badge badge-success" style={{ fontSize: "0.7rem", marginTop: "0.2rem" }}>
                  Verified Seller
                </span>
              </div>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
              Member ID: {product.sellerId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
