import api from "./api";
import type { Order } from "../types/order";

export const checkout = async () => {
    const response = await api.post("/orders/checkout")

    console.log("Checkout response:", response.data);

    return response.data
}

export const getMyOrders = async (): Promise<Order[]> => {
    const response = await api.get("/orders/my-orders");

    return response.data.data;
}

export const getOrderById = async (orderId: string): Promise<Order> => {
    const response = await api.get(`/orders/${orderId}`);

    return response.data.data;
}