import { Messages } from "../config/messages.js";
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
  if (!id) {
    return res.status(400).json({ error: "Product ID is required." });
  }
  const existingProduct = await productModel.getProductById(id);
  if (!existingProduct) {
    return res.status(404).json({ error: "Product not found." });
  }
  const p = await productModel.getProduct(id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Product ID is required." });
  }
  const existingProduct = await productModel.getProductById(id);
  if (!existingProduct) {
    return res.status(404).json({ error: "Product not found." });
  }
  const p = await productModel.updateProduct(id, req.body);
  res.json(p);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Product ID is required." });
  }
  const existingProduct = await productModel.getProductById(id);
  if (!existingProduct) {
    return res.status(404).json({ error: "Product not found." });
  }

  await productModel.deleteProduct(id);
  res.json({ success: true });
};

export const bulkInsertProducts = async (req, res) => {
  try {
    const products = req.body.products;

    const inserted = await productModel.bulkInsertProducts(products);
    res.json({ inserted, message: "Products inserted successfully." });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getProductsByCategoriesWithFilter = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      categoryId = null,
      minPrice = null,
      maxPrice = null,
      inStock = null,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // ✅ TYPE CASTING (VERY IMPORTANT)
    page = Number(page);
    limit = Number(limit);

    if (minPrice !== null) minPrice = Number(minPrice);
    if (maxPrice !== null) maxPrice = Number(maxPrice);

    if (inStock !== null) inStock = inStock === "true";

    const filteredListandCount = await productModel.listProducts({
      page,
      limit,
      search,
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      data: filteredListandCount,
      message: Messages.PRODUCT.PRODUCTS_FETCH_SUCCESS,
    });
  } catch (error) {
    console.error("Product Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
};
