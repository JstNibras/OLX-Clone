import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getProductById, updateProduct } from "../../services/productService";
import type { Product } from "../../types/product";

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

const CATEGORIES = [
  "Cars & Vehicles",
  "Mobiles & Tablets",
  "Electronics & Appliances",
  "Furniture & Home",
  "Fashion & Beauty",
  "Sports & Hobbies",
  "Books & Learning",
  "Other",
];

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const currentImageUrl = watch("imageUrl");

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
        reset({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          imageUrl: data.images && data.images[0] ? data.images[0] : "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, reset]);

  const onSubmit = async (data: ProductFormData) => {
    if (!id || !product) return;

    setError("");

    try {
      const finalImages = data.imageUrl?.trim()
        ? [data.imageUrl.trim()]
        : product.images;

      await updateProduct(id, {
        title: data.title.trim(),
        description: data.description.trim(),
        price: data.price,
        category: data.category.trim(),
        images: finalImages,
      });

      navigate("/my-listings");
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to update product.");
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Loading ad details...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h2 className="empty-state-title">Listing Not Available</h2>
          <p className="empty-state-desc">{error}</p>
          <Link to="/my-listings" className="btn btn-primary btn-sm">
            ← Back to My Ads
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  if (product.status !== "AVAILABLE") {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <h2 className="empty-state-title">Listing Cannot Be Edited</h2>
          <p className="empty-state-desc">
            This product has already been marked as sold or is no longer available.
          </p>
          <Link to="/my-listings" className="btn btn-secondary btn-sm">
            ← Back to My Ads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="product-form-container">
        <div className="product-form-card">
          <div style={{ marginBottom: "1.75rem", borderBottom: "1px solid var(--color-divider)", paddingBottom: "1rem" }}>
            <h1 className="page-title" style={{ fontSize: "1.5rem" }}>
              Edit Ad
            </h1>
            <p className="page-subtitle">Modify details or update price for your listing</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Ad Title *
              </label>
              <input
                id="title"
                className={`form-input ${errors.title ? "has-error" : ""}`}
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
              />
              {errors.title && (
                <span className="form-error">{errors.title.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Description *
              </label>
              <textarea
                id="description"
                className={`form-textarea ${errors.description ? "has-error" : ""}`}
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                })}
              />
              {errors.description && (
                <span className="form-error">{errors.description.message}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="price">
                  Price (₹) *
                </label>
                <input
                  id="price"
                  type="number"
                  className={`form-input ${errors.price ? "has-error" : ""}`}
                  {...register("price", {
                    required: "Price is required",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Price must be greater than 0",
                    },
                  })}
                />
                {errors.price && (
                  <span className="form-error">{errors.price.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  Category *
                </label>
                <select
                  id="category"
                  className={`form-select ${errors.category ? "has-error" : ""}`}
                  {...register("category", {
                    required: "Category is required",
                  })}
                >
                  <option value="" disabled>
                    Select a Category
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="form-error">{errors.category.message}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="imageUrl">
                Image URL
              </label>
              <input
                id="imageUrl"
                className="form-input"
                placeholder="https://example.com/image.jpg"
                {...register("imageUrl")}
              />

              {currentImageUrl && (
                <div className="image-preview-wrapper">
                  <img
                    src={currentImageUrl}
                    alt="Preview"
                    className="image-preview"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    onLoad={(e) => {
                      e.currentTarget.style.display = "block";
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.75rem" }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving Changes..." : "Update Ad"}
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={() => navigate("/my-listings")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
