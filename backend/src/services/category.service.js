const Category = require("../models/category.model");

const getCategories = async () => {
  const categories = await Category.find().sort({ name: 1 });
  // Move "Other" to the end
  return categories.sort((a, b) => {
    if (a.name === "Other") return 1;
    if (b.name === "Other") return -1;
    return 0; // Keep alphabetical for others
  });
};

const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
};

const createCategory = async (data) => {
  // Check if category exists
  const existingCategory = await Category.findOne({ name: data.name });
  if (existingCategory) {
    throw new Error("Category already exists");
  }
  return await Category.create(data);
};

const updateCategory = async (id, data) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error("Category not found");
  }

  // If name is being updated, slug will be updated by pre-save middleware
  // BUT findByIdAndUpdate doesn't trigger pre-save hooks by default.
  // We can either use save() or rely on simple update if we don't care about complex hooks,
  // but for slug we should better save.

  // However, to keep it simple and consistent with standard updates:
  if (data.name) {
    // Check if new name conflicts with another category
    const duplicate = await Category.findOne({ name: data.name });
    if (duplicate && duplicate._id.toString() !== id) {
      throw new Error("Category name already taken");
    }
  }

  // For slug update to work with findByIdAndUpdate, we usually need to handle it manually or use .save()
  // Let's use Object.assign and .save() to trigger middleware
  Object.assign(category, data);
  await category.save();
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new Error("Category not found");
  }
  // Optional: Check if documents assume this category constraint
  return category;
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
