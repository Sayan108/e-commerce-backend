import { Messages } from "../../config/messages.js";
import CategoryModel from "./category.model.js";

class CategoriesController {
  async createCategory(req, res) {
    try {
      const c = await CategoryModel.createCategory(req.body);
      res.json({ c, message: Messages.CATEGORY.CATEGORY_CREATED });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: Messages.CATEGORY.ERROR_CATAGORY_CREATION });
    }
  }

  async getAllCategories(req, res) {
    try {
      const list = await CategoryModel.listCategories();
      res.json({ list, message: Messages.CATEGORY.CATEGORIES_FETCH_SUCCESS });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: Messages.CATEGORY.CATEGORY_FETCH_SUCCESS });
    }
  }

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Category ID is required." });
      }
      const existingCategory = await CategoryModel.getCategoryById(id);
      if (!existingCategory) {
        return res.status(404).json({ error: "Category not found." });
      }

      await CategoryModel.deleteCategory(id);
      res.json({ message: Messages.CATEGORY.CATEGORY_DELETED });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: Messages.CATEGORY.ERROR_CATEGORY_DELETION });
    }
  }

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Category ID is required." });
      }
      const existingCategory = await CategoryModel.getCategoryById(id);
      if (!existingCategory) {
        return res.status(404).json({ error: "Category not found." });
      }
      const updated = await CategoryModel.updateCategory(id, req.body);
      res.json({ updated, message: Messages.CATEGORY.CATEGORY_UPDATED });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: Messages.CATEGORY.ERROR_CATEGORY_UPDATE });
    }
  }

  async bulkInsertCategories(req, res) {
    try {
      const categories = req.body.categories;
      const inserted = await CategoryModel.bulkInsertCategories(categories);
      res.json({ inserted, message: "Categories inserted successfully." });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getFeaturedCategories(req, res) {
    try {
      const featured = await CategoryModel.listFeaturedCategories();
      res.json({
        featured,
        message: "Featured categories fetched successfully ",
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default CategoriesController;
