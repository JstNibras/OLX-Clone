import type { Request, Response } from "express";
import mongoose from "mongoose";
import { 
    addProductToCart,
    getUserCart,
    removeProductFromCart,
} from "../services/cartService.js";

export const addToCartController = async (req: Request, res: Response) => {
    try {
        const productId = typeof req.params.productId === "string" ? req.params.productId : req.params.productId?.[0];

        if(!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const result = await addProductToCart(
            req.userId,
            productId
        );

        if(result.error === "PRODUCT_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Product not found, unavailable, or deleted",
            });
        }

        if(result.error === "OWN_PRODUCT") {
            return res.status(400).json({
                success: false,
                message: "You cannot add your own product to the cart",
            });
        }

        if (result.error === "ALREADY_IN_CART") {
            return res.status(409).json({
                success: false,
                message: "Product is already in your cart",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            data: result.cart,
        });
    } catch (error) {
        console.error("Add to cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add product to cart",
        });
    }
};

export const getCartController = async (req: Request, res: Response) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const cart = await getUserCart(req.userId);

        return res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        console.error("Get cart error : ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
        });
    }
};

export const removeFromCartController = async (req: Request, res: Response) => {
    try {
        const productId = typeof req.params.productId === "string" ? req.params.productId : req.params.productId?.[0];

        if(!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const cart = await removeProductFromCart(req.userId, productId);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            data: cart,
        });
    } catch (error) {
        console.error("Remove from cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove product from cart",
        });
    }
};
