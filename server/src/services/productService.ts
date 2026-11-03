import Product from "../models/Product";

export const getAvailableProducts = async () => {
    return Product.find({ status: "AVAILABLE" })
        .sort({ createdAt: -1 })
        .lean();
}