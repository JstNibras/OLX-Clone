import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/productService";

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

const CreateProductPage = () => {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>();

  const onSubmit = async (data: ProductFormData) => {
    try {
      await createProduct({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        images: [data.imageUrl],
      });

      navigate("/my-listings");
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <div>
      <h1>Create Product</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="title">Title</label>

          <input
            id="title"
            {...register("title", { required: "Title is required" })}
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

        <div>
          <label htmlFor="imageUrl">Image URL</label>

          <input
            id="imageUrl"
            {...register("imageUrl", {
              required: "Image URL is required",
            })}
          />

          {errors.imageUrl && <p>{errors.imageUrl.message}</p>}
        </div>

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProductPage;