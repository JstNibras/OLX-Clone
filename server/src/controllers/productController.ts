import type { Request, Response } from "express";
import { getAvailableProducts } from "../services/productService";

export const getProducts = async (
    _req: Request,
    res: Response
) => {
    try {
        const products = await getAvailableProducts();

        return res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        })
    } catch (error) {
        console.error("Get products error: ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        })
    }
}