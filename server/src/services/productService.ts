import Product from "../models/Product.js";

interface ProductQuery {
    search?: string;
    category?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

interface CreateProductInput {
    sellerId: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
}

interface UpdateProductInput {
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
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
        status: "AVAILABLE",
        isDeleted: false,
    }

    if(search) {
        filter.title = {
            $regex: search,
            $options: "i",
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
        status: "AVAILABLE",
        isDeleted: false,
    }).lean();
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

export const getMyProducts = async (sellerId: string) => {
    return Product.find({ sellerId, isDeleted: false })
        .sort({ createdAt: -1 })
        .lean()
}

export const updateProduct = async ( productId: string, sellerId: string, input: UpdateProductInput) => {
    return Product.findOneAndUpdate(
        {
            _id: productId,
            sellerId,
            status: "AVAILABLE",
            isDeleted: false,
        },
        {
            $set: {
                title: input.title,
                description: input.description,
                price: input.price,
                category: input.category,
                images: input.images,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    ).lean();
}

export const deleteProduct = async ( productId: string, sellerId: string) => {
    return Product.findOneAndUpdate(
        {
            _id: productId,
            sellerId,
            status: "AVAILABLE",
            isDeleted: false,
        },
        {
            $set: {
                isDeleted: true,
            },
        },
        {
            new: true,
        }
    ).lean();
}