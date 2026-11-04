import api from "./api";
import type { ProductListResponse, Product } from "../types/product";

export interface ProductQueryParams {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const getProducts = async (
  params: ProductQueryParams = {}
): Promise<ProductListResponse> => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

export const getProductById = async (
  productId: string
): Promise<Product> => {
  const response = await api.get(`/products/${productId}`);
  return response.data.data;
};