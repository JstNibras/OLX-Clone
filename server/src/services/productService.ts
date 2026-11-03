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

export const getProductById = async (productId: string) => {
    return Product.findOne({
        _id: productId,
        status: "AVAILABLE"
    }).lean();
}

interface CreateProductInput {
    sellerId: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
}

export const createProduct = async (input: CreateProductInput) => {
    return Product.create({
        sellerId: input.sellerId,
        title: input.title,
        description: input.description,
        price: input.price,
        category: input.category,
        images: input.images,
    })
}