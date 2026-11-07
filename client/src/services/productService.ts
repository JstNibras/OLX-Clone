import api from "./api";
import type { ProductListResponse, Product } from "../types/product";

export interface ProductQueryParams {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

export interface UpdateProductData {
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

export const getProducts = async (params: ProductQueryParams = {}): Promise<ProductListResponse> => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const getProductById = async (productId: string): Promise<Product> => {
  const response = await api.get(`/products/${productId}`);
  return response.data.data;
};

export const getMyListings = async (): Promise<Product[]> => {
  const response = await api.get("/products/my-listings");
  return response.data.data;
};

export const createProduct = async (productData: CreateProductData): Promise<Product> => {
  const response = await api.post("/products", productData);
  return response.data.data;
};

export const updateProduct = async (productId: string, productData: UpdateProductData): Promise<Product> => {
  const response = await api.put(`/products/${productId}`, productData);
  return response.data.data;
};

export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<{ success: boolean; imageUrl: string }>(
    "/products/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.imageUrl;
};
