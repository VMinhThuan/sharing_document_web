const categoryService = require("../services/category.service");
const { successResponse, errorResponse } = require("../utils/response");

const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    successResponse(res, 200, "Categories retrieved", categories);
  } catch (error) {
    errorResponse(res, 500, "Server Error", error.message);
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    successResponse(res, 200, "Category retrieved", category);
  } catch (error) {
    errorResponse(res, 404, "Category not found", error.message);
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    successResponse(res, 201, "Category created", category);
  } catch (error) {
    errorResponse(res, 400, "Creation failed", error.message);
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body,
    );
    successResponse(res, 200, "Category updated", category);
  } catch (error) {
    errorResponse(res, 400, "Update failed", error.message);
  }
};

const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    successResponse(res, 200, "Category deleted");
  } catch (error) {
    errorResponse(res, 400, "Deletion failed", error.message);
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
