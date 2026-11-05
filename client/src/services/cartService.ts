import api from "./api";

export const addToCart = async (productId: string) => {
    const response = await api.post(`/cart/${productId}`);

    return response.data;
}