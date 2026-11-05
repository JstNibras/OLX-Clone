import api from "./api";

export const checkout = async () => {
    const response = await api.post("/orders/checkout")

    console.log("Checkout response:", response.data);

    return response.data
}