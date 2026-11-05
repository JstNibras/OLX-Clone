import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addProductToCart } from "../../features/cart/cartSlice";

import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";

const ProductsPage = () => {
  const dispatch = useAppDispatch();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addingToCart = useAppSelector(
    (state) => state.cart.isAdding
  );

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
          limit: 10,
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
    } catch (error) {
      setCartMessage(
        typeof error === "string"
          ? error
          : "Failed to add product to cart"
      );
    }
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSort(event.target.value);
    setPage(1);
  };

  return (
    <div>
      <h1>Products</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={handleSearchChange}
      />

      <select value={sort} onChange={handleSortChange}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>

      {isLoading && <p>Loading products...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && products.length === 0 && (
        <p>No products found.</p>
      )}

      {!isLoading && !error && (
        <div>
          {products.map((product) => (
            <div key={product._id}>
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.images[0]}
                  alt={product.title}
                  width="200"
                />
              </Link>

              <h3>
                <Link to={`/products/${product._id}`}>
                  {product.title}
                </Link>
              </h3>

              <p>{product.category}</p>

              <p>₹{product.price.toLocaleString("en-IN")}</p>

              <button
                onClick={() => handleAddToCart(product._id)}
                disabled={addingToCart || product.status !== "AVAILABLE"}
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>

              {cartMessage && <p>{cartMessage}</p>}
            </div>
          ))}
        </div>
      )}

      <div>
        <button
          disabled={page <= 1 || isLoading}
          onClick={() => setPage((current) => current - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages || isLoading || totalPages === 0}
          onClick={() => setPage((current) => current + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;