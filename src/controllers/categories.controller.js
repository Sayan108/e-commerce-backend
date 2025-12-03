import { Messages } from "../config/messages.js";
import categoryModel from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const c = await categoryModel.createCategory(req.body);
    res.json({ c, message: Messages.CATEGORY.CATEGORY_CREATED });
  } catch (error) {
    res
      .status(500)
      .json({ error, message: Messages.CATEGORY.ERROR_CATAGORY_CREATION });
  }
};

export const getAllCategories = async (res) => {
  try {
    const list = await categoryModel.listCategories();
    res.json({ list, message: Messages.CATEGORY.CATEGORIES_FETCH_SUCCESS });
  } catch (error) {
    res
      .status(500)
      .json({ error, message: Messages.CATEGORY.CATEGORY_FETCH_SUCCESS });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Category ID is required." });
    }
    const existingCategory = await categoryModel.getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found." });
    }

    await categoryModel.deleteCategory(id);
    res.json({ message: Messages.CATEGORY.CATEGORY_DELETED });
  } catch (error) {
    res
      .status(500)
      .json({ error, message: Messages.CATEGORY.ERROR_CATEGORY_DELETION });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Category ID is required." });
    }
    const existingCategory = await categoryModel.getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found." });
    }
    const updated = await categoryModel.updateCategory(id, req.body);
    res.json({ updated, message: Messages.CATEGORY.CATEGORY_UPDATED });
  } catch (error) {
    res
      .status(500)
      .json({ error, message: Messages.CATEGORY.ERROR_CATEGORY_UPDATE });
  }
};

export const bulkInsertCategories = async (req, res) => {
  try {
    const categories = req.body.categories;
    const inserted = await categoryModel.bulkInsertCategories(categories);
    res.json({ inserted, message: "Categories inserted successfully." });
  } catch (error) {
    res.status(500).json({ error });
  }
};
