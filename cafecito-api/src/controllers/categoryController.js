import Category from "../models/Category.js";
import Product from "../models/Product.js";

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate("parentCategory");
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).populate("parentCategory");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, imageURL, parentCategory } = req.body;
    const newCategory = await Category.create({
      name,
      description,
      imageURL,
      parentCategory: parentCategory || null,
    });
    await newCategory.populate("parentCategory");
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, imageURL, parentCategory } = req.body;

    const updates = { name, description, imageURL };
    if (parentCategory !== undefined) {
      updates.parentCategory = parentCategory || null;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("parentCategory");

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const productsInCategory = await Product.countDocuments({ category: id });
    if (productsInCategory > 0) {
      return res.status(409).json({
        message: "Cannot delete a category that still has products",
        products: productsInCategory,
      });
    }

    const childCategories = await Category.countDocuments({
      parentCategory: id,
    });
    if (childCategories > 0) {
      return res.status(409).json({
        message: "Cannot delete a category that still has subcategories",
        subcategories: childCategories,
      });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getProductsByCategoryAndChildren = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let categoryIds = [category._id];

    if (category.parentCategory === null) {
      const children = await Category.find({ parentCategory: id }).select("_id");
      categoryIds = [category._id, ...children.map((c) => c._id)];
    }

    const filters = { category: { $in: categoryIds }, available: true };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filters)
      .populate("category")
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(filters);
    const totalPages = Math.ceil(totalProducts / parseInt(limit)) || 1;

    res.json({
      category,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalResults: totalProducts,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getCategories,
  getCategoryById,
  getProductsByCategoryAndChildren,
  createCategory,
  updateCategory,
  deleteCategory,
};
