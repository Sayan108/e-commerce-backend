import productModel from "../models/product.model.js";

export const createProducts = async (req, res) => {
  const p = await productModel.createProduct(req.body);
  res.json(p);
};
export const getAllProducts = async (req, res) => {
  const list = await productModel.listProducts();
  res.json(list);
};

export const getProductById = async (req, res) => {
  const p = await productModel.getProduct(req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
};

export const updateProduct = async (req, res) => {
  const p = await productModel.updateProduct(req.params.id, req.body);
  res.json(p);
};

export const deleteProduct = async (req, res) => {
  await productModel.deleteProduct(req.params.id);
  res.json({ success: true });
};
