import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { getProductById, updateProduct } from "../../services/productService";
import type { Product } from "../../types/product";

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
}

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
  }, [id]);

  const onSubmit = async (data: ProductFormData) => {
    if (!id) return;

    setError("");

    try {
      await updateProduct(id, {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        images: product.images,
      });

      navigate("/my-listings");
    } catch (err) {
      console.error(err);
      setError("Failed to update product.");
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
            })}
          />

          {errors.title && <p>{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            })}
          />

          {errors.description && <p>{errors.description.message}</p>}
        </div>

        <div>
          <label htmlFor="price">Price</label>

          <input
            id="price"
            type="number"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Price must be greater than 0",
              },
            })}
          />

          {errors.price && <p>{errors.price.message}</p>}
        </div>

        <div>
          <label htmlFor="category">Category</label>

          <input
            id="category"
            {...register("category", {
              required: "Category is required",
            })}
          />

          {errors.category && <p>{errors.category.message}</p>}
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