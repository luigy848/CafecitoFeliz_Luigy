import Product from "../models/Product.js";
import Category from "../models/Category.js";

const buildPagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / parseInt(limit)) || 1;
  return {
    currentPage: parseInt(page),
    totalPages,
    totalResults: total,
    hasNext: parseInt(page) < totalPages,
    hasPrev: parseInt(page) > 1,
  };
};

const searchProducts = async (req, res, next) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      available,
      sort = "name",
      order = "asc",
      page = 1,
      limit = 20,
    } = req.query;

    const filters = {};

    if (q) {
      filters.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }
    if (category) filters.category = category;

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    if (available === "true") filters.available = true;
    else if (available === "false") filters.available = false;

    const sortOptions = {};
    sortOptions[sort] = order === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filters)
      .populate("category")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(filters);

    res.json({
      products,
      pagination: buildPagination(page, limit, totalProducts),
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const {
      sort = "name",
      order = "asc",
      page = 1,
      limit = 20,
      includeUnavailable,
    } = req.query;

    const filters = {};
    if (includeUnavailable !== "true") filters.available = true;

    const sortOptions = {};
    sortOptions[sort] = order === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filters)
      .populate("category")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(filters);

    res.json({
      products,
      pagination: buildPagination(page, limit, totalProducts),
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, available, imageURL } =
      req.body;

    if (category) {
      const categoryExist = await Category.findById(category);
      if (!categoryExist) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      available,
      imageURL,
    });

    await newProduct.populate("category");

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, available, imageURL } =
      req.body;

    if (category) {
      const categoryExist = await Category.findById(category);
      if (!categoryExist) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, category, available, imageURL },
      { new: true, runValidators: true },
    ).populate("category");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export {
  searchProducts,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
