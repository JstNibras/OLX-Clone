import type { Request, Response } from "express";
import { getAvailableProducts } from "../services/productService";

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