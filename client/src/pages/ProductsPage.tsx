import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addProductToCart } from "../features/cart/cartSlice";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";
import { FALLBACK_IMAGE } from "../constants";

const ProductsPage = () => {
  const dispatch = useAppDispatch();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addingToCart = useAppSelector((state) => state.cart.isAdding);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getProducts({
          search,
          sort,
          page,
          limit: 8,
        });

        setProducts(result.products);
        setTotalPages(result.totalPages);
      } catch {
        setError("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [search, sort, page]);

  const handleAddToCart = async (productId: string) => {
    try {
      setCartMessage("");
      await dispatch(addProductToCart(productId)).unwrap();
      setCartMessage("Product added to cart successfully!");
    } catch (err) {
      setCartMessage(
        typeof err === "string" ? err : "Failed to add product to cart"
      );
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(event.target.value);
    setPage(1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fresh Recommendations</h1>
          <p className="page-subtitle">
            Discover great deals on pre-owned electronics, vehicles, furniture and more
          </p>
        </div>
      </div>

      <div className="products-toolbar">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="form-input"
            placeholder="Search products by title, category, keywords..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="sort-select-wrapper">
          <select className="form-select" value={sort} onChange={handleSortChange}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

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

      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Loading recommendations...</p>
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h2 className="empty-state-title">No products found</h2>
          <p className="empty-state-desc">
            We couldn't find any products matching your search query. Try different keywords or reset your filters.
          </p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearch("");
              setSort("newest");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <Link to={`/products/${product._id}`} className="product-card-image-wrap">
                <img
                  src={product.images && product.images[0] ? product.images[0] : FALLBACK_IMAGE}
                  alt={product.title}
                  className="product-card-img"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                {product.status !== "AVAILABLE" && (
                  <span className="badge badge-danger product-card-badge">
                    {product.status}
                  </span>
                )}
              </Link>

              <div className="product-card-body">
                <div className="product-card-price">
                  ₹{product.price.toLocaleString("en-IN")}
                </div>

                <Link to={`/products/${product._id}`}>
                  <h3 className="product-card-title">{product.title}</h3>
                </Link>

                <div className="product-card-footer">
                  <span className="badge badge-category">{product.category}</span>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddToCart(product._id)}
                    disabled={addingToCart || product.status !== "AVAILABLE"}
                  >
                    {addingToCart ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary btn-sm"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((current) => current - 1)}
          >
            ← Previous
          </button>

          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>

          <button
            className="btn btn-secondary btn-sm"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((current) => current + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
