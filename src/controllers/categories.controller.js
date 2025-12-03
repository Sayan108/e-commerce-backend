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

export const bulkInsertCategories = async (req, res) => {
  try {
    console.log(req.body.categories);
    const categories = req.body.categories;
    const inserted = await categoryModel.bulkInsertCategories(categories);
    res.json({ inserted, message: "Categories inserted successfully." });
  } catch (error) {
    res.status(500).json({ error });
  }
};
