import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getProductById, updateProduct, uploadProductImage } from "../services/productService";
import type { Product } from "../types/product";

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>();

  const [product, setProduct] = useState<Product | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newPreviewUrl, setNewPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");
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
        reset({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Please select a valid image file (JPEG, PNG, WEBP, GIF).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("Image size must be less than 5MB.");
      return;
    }

    setNewFile(file);
    const objectUrl = URL.createObjectURL(file);
    setNewPreviewUrl(objectUrl);
  };

  const handleRevertPhoto = () => {
    setNewFile(null);
    if (newPreviewUrl) {
      URL.revokeObjectURL(newPreviewUrl);
    }
    setNewPreviewUrl(null);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!id || !product) return;

    setError("");

    try {
      setIsSubmitting(true);

      let finalImages = product.images;

      if (newFile) {
        const uploadedUrl = await uploadProductImage(newFile);
        finalImages = [uploadedUrl];
      }

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
      setError("Failed to update product. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
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

  const currentDisplayPhoto = newPreviewUrl || (product.images && product.images[0]) || "";

  return (
    <div className="page-container">
      <div className="product-form-container">
        <div className="product-form-card">
          <div
            style={{
              marginBottom: "1.75rem",
              borderBottom: "1px solid var(--color-divider)",
              paddingBottom: "1rem",
            }}
          >
            <h1 className="page-title" style={{ fontSize: "1.5rem" }}>
              Edit Ad
            </h1>
            <p className="page-subtitle">
              Modify details, change price, or update photos for your listing
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
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

            {/* Description */}
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

            {/* Price & Category */}
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

            {/* Photo Section */}
            <div className="form-group">
              <label className="form-label">Product Photo</label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <div className="file-upload-preview-box">
                {currentDisplayPhoto ? (
                  <img
                    src={currentDisplayPhoto}
                    alt="Current product"
                    className="file-upload-thumb"
                  />
                ) : (
                  <div
                    style={{
                      width: "90px",
                      height: "75px",
                      backgroundColor: "#f1f5f9",
                      borderRadius: "var(--radius-sm)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    📷
                  </div>
                )}

                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-text-primary)" }}>
                    {newFile ? `New photo: ${newFile.name}` : "Current Listing Photo"}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                    {newFile
                      ? `${(newFile.size / 1024).toFixed(1)} KB (ready to upload)`
                      : "Choose a new file to replace this photo"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {newFile ? "Change Photo" : "Upload New Photo"}
                  </button>

                  {newFile && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={handleRevertPhoto}
                    >
                      Keep Original
                    </button>
                  )}
                </div>
              </div>

              {fileError && <span className="form-error">{fileError}</span>}
            </div>

            {/* Actions */}
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
