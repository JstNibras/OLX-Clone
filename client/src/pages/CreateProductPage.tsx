import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { createProduct, uploadProductImage } from "../services/productService";

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

const CreateProductPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>();

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

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!selectedFile) {
      setFileError("Please select a photo for your product.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const uploadedImageUrl = await uploadProductImage(selectedFile);

      await createProduct({
        title: data.title.trim(),
        description: data.description.trim(),
        price: data.price,
        category: data.category.trim(),
        images: [uploadedImageUrl],
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
          <div
            style={{
              marginBottom: "1.75rem",
              borderBottom: "1px solid var(--color-divider)",
              paddingBottom: "1rem",
            }}
          >
            <h1 className="page-title" style={{ fontSize: "1.5rem" }}>
              Post Your Ad
            </h1>
            <p className="page-subtitle">
              Reach buyers quickly by uploading clear photos and details
            </p>
          </div>

          {submitError && <div className="alert alert-danger">{submitError}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
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

            {/* Description */}
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

            {/* Photo Upload from Computer */}
            <div className="form-group">
              <label className="form-label">Product Photo *</label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {!previewUrl ? (
                <div
                  className="file-upload-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="file-upload-icon">📷</div>
                  <div className="file-upload-text">
                    Click to select a photo from your computer
                  </div>
                  <div className="file-upload-subtext">
                    Supported formats: JPG, PNG, WEBP, GIF (Max 5MB)
                  </div>
                </div>
              ) : (
                <div className="file-upload-preview-box">
                  <img
                    src={previewUrl}
                    alt="Selected preview"
                    className="file-upload-thumb"
                  />

                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-text-primary)" }}>
                      {selectedFile?.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      {selectedFile ? (selectedFile.size / 1024).toFixed(1) + " KB" : ""}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger-outline btn-sm"
                      onClick={handleRemovePhoto}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

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
                {isSubmitting ? "Uploading & Publishing..." : "Post Now"}
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
