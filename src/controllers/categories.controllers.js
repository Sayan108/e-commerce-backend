import categoryModel from "../models/category.model.js";

export const createCategory = async (req, res) => {
  const c = await categoryModel.createCategory(req.body);
  res.json(c);
};

export const getAllCategories = async (res) => {
  const list = await categoryModel.listCategories();
  res.json(list);
};
