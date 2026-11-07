import api from "./api";
import type { CartResponse } from "../types/cart";

export const addToCart = async (productId: string) => {
    const response = await api.post(`/cart/${productId}`);

    return response.data;
}

export const getCart = async () => {
    const response = await api.get<CartResponse>("/cart");

    return response.data.data.productIds;
}

export const removeFromCart = async (productId: string) => {
    const response = await api.delete(`/cart/${productId}`);

    return response.data;
}