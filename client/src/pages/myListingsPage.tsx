import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyListings } from "../services/productService";
import type { Product } from "../types/product";
import { FALLBACK_IMAGE } from "../constants";

const MyListingsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listings = await getMyListings();
        setProducts(listings);
      } catch (err) {
        console.error(err);
        setError("Failed to load your listings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Loading your listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Ads</h1>
          <p className="page-subtitle">
            Manage your active and sold listings
          </p>
        </div>

        <Link to="/create-product" className="btn btn-sell">
          + Post New Ad
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏷️</div>
          <h2 className="empty-state-title">You haven't listed any items yet</h2>
          <p className="empty-state-desc">
            Got things you don't use anymore? Post an ad now and start earning cash!
          </p>
          <Link to="/create-product" className="btn btn-sell">
            + Post Your First Ad
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-card-image-wrap">
                <img
                  src={
                    product.images && product.images[0]
                      ? product.images[0]
                      : FALLBACK_IMAGE
                  }
                  alt={product.title}
                  className="product-card-img"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <span
                  className={`badge product-card-badge ${product.status === "AVAILABLE"
                      ? "badge-success"
                      : "badge-danger"
                    }`}
                >
                  {product.status}
                </span>
              </div>

              <div className="product-card-body">
                <div className="product-card-price">
                  ₹{product.price.toLocaleString("en-IN")}
                </div>

                <Link to={`/products/${product._id}`}>
                  <h3 className="product-card-title">{product.title}</h3>
                </Link>

                <div className="product-card-footer">
                  <span className="badge badge-category">{product.category}</span>

                  {product.status === "AVAILABLE" && (
                    <Link
                      to={`/edit-product/${product._id}`}
                      className="btn btn-outline btn-sm"
                    >
                      Edit Ad
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;
