import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  data: {
    _id?: string;
    userId: string;
    productIds: Product[];
    createdAt?: string;
    updatedAt?: string;
  };
}