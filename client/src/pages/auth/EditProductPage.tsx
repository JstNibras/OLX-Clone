import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../../services/productService";
import type { Product } from "../../types/product";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getProductById(id);

        setProduct(data);
        setTitle(data.title);
        setDescription(data.description);
        setPrice(String(data.price));
        setCategory(data.category);
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) return;

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await updateProduct(id, {
        title,
        description,
        price: numericPrice,
        category,
      });

      navigate("/my-listings");
    } catch (err) {
      console.error(err);
      setError("Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading product...</p>;

  if (error && !product) return <p>{error}</p>;

  if (!product) return <p>Product not found.</p>;

  if (product.status !== "AVAILABLE") {
    return <p>This product can no longer be edited.</p>;
  }

  return (
    <div>
      <h1>Edit Product</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Product"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/my-listings")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;