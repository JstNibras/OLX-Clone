import Product from "../models/Product";

interface ProductQuery {
    search?: string;
    category?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

export const getAvailableProducts = async (query: ProductQuery) => {
    const {
        search,
        category,
        sort = "newest",
        page = 1,
        limit = 10,
    } = query;

    const filter: Record<string, unknown> = {
        status: "AVAILABLE"
    }

    if(search) {
        filter.title = {
            $regex: search,
            $option: "i",
        }
    }

    if (category) {
        filter.category = category;
    }

    const sortOptions: Record<string, 1 | -1> = {};

    switch (sort) {
        case "price_asc":
            sortOptions.price = 1;
            break;

        case "price_desc":
            sortOptions.price = -1;
            break;

        case "oldest":
            sortOptions.createdAt = 1;
            break;

        default:
            sortOptions.createdAt = -1;
    }

    const skip = (page -1) * limit;

    const [products, totalProducts] = await Promise.all([
        Product.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean(),

        Product.countDocuments(filter),
    ])

    return {
        products,
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
    }
}