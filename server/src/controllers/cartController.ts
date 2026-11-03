import type { Request, Response } from "express";
import mongoose from "mongoose";
import { addProductToCart } from "../services/cartService";

export const addToCartController = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            })
        }

        const result = await addProductToCart(
            req.userId,
            productId
        )

        if(result.error === "PRODUCT_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Product not found, unavailable, or deleted",
            })
        }

        if(result.error === "OWN_PRODUCT") {
            return res.status(400).json({
                success: false,
                message: "You cannot add your own product to the cart"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            data: result.cart,
        })
    } catch (error) {
        console.error("Add to cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add product to cart",
        });
    }
}