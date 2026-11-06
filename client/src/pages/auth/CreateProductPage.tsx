import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "../../services/productService";

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
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

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>();

  const currentImageUrl = watch("imageUrl");

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError("");

      await createProduct({
        title: data.title.trim(),
        description: data.description.trim(),
        price: data.price,
        category: data.category.trim(),
        images: [data.imageUrl.trim()],
      });

      navigate("/my-listings");
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to publish listing. Please check your inputs.";
      setSubmitError(errorMsg || "Failed to publish listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="product-form-container">
        <div className="product-form-card">
          <div style={{ marginBottom: "1.75rem", borderBottom: "1px solid var(--color-divider)", paddingBottom: "1rem" }}>
            <h1 className="page-title" style={{ fontSize: "1.5rem" }}>
              Post Your Ad
            </h1>
            <p className="page-subtitle">
              Reach thousands of buyers by listing your item accurately
            </p>
          </div>

          {submitError && <div className="alert alert-danger">{submitError}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Ad Title *
              </label>
              <input
                id="title"
                className={`form-input ${errors.title ? "has-error" : ""}`}
                placeholder="e.g. iPhone 13 Pro 128GB - Graphite"
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
                placeholder="Include condition, age, accessories, and reason for selling..."
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
                  placeholder="e.g. 15000"
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
                  defaultValue=""
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
                Image URL *
              </label>
              <input
                id="imageUrl"
                className={`form-input ${errors.imageUrl ? "has-error" : ""}`}
                placeholder="https://example.com/item-photo.jpg"
                {...register("imageUrl", {
                  required: "Image URL is required",
                  pattern: {
                    value: /^https?:\/\/.+/i,
                    message: "Please enter a valid HTTP/HTTPS image URL",
                  },
                })}
              />
              {errors.imageUrl && (
                <span className="form-error">{errors.imageUrl.message}</span>
              )}

              {currentImageUrl && (
                <div className="image-preview-wrapper">
                  <img
                    src={currentImageUrl}
                    alt="Product preview"
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
                {isSubmitting ? "Publishing Ad..." : "Post Now"}
              </button>

              <Link to="/my-listings" className="btn btn-secondary btn-lg">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
