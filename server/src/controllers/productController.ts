import mongoose from "mongoose";

import type { Request, Response } from "express";
import { getAvailableProducts, getProductById, createProduct } from "../services/productService.js";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(
            59,
            Math.max(1, Number(req.query.limit) || 0)
        )

        const search = typeof req.query.search === "string"
                            ? req.query.search.trim() : undefined;

        const category  = typeof req.query.category === "string"
                            ? req.query.category.trim() : undefined;

        const sort = typeof req.query.sort === "string"
                            ? req.query.sort : "newest";

        const result = await getAvailableProducts({
            search,
            category,
            sort,
            page,
            limit,
        })

        return res.status(200).json({
            success: true,
            ...result,
        })
    } catch (error) {
        console.error("Get products error : ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        })
    }
}

export const getProductDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const product = await getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            })
        }

        return res.status(200).json({
            success: true,
            data: product,
        })
    } catch (error) {
        console.log("Get product details error: ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch prodyct details",
        })
    }
}

export const createProductController = async (req: Request, res: Response) => {
    try {
        const { title, description, price, category, images } = req.body;

        if (
            !title ||
            !description ||
            price === undefined ||
            !category ||
            !Array.isArray(images) ||
            images.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const parsedPrice = Number(price);

        if(!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be valid non-negative number"
            })
        }

        const product = await createProduct({
            sellerId: req.userId,
            title,
            description,
            price: parsedPrice,
            category,
            images,
        })

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        })
    } catch (error) {
        console.error("Creat product error : ", error)

        return res.status(500).json({
            success: false,
            message: "Failed to create product"
        })
    }
}