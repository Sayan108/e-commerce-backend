import { Messages } from "../config/messages.js";
import productModel from "../models/product.model.js";

/* ---------------- CREATE PRODUCT ---------------- */
export const createProducts = async (req, res) => {
  try {
    const product = await productModel.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ---------------- GET ALL PRODUCTS ---------------- */
export const getAllProducts = async (req, res) => {
  try {
    const list = await productModel.listProducts();
    res.status(200).json(list);
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ---------------- GET PRODUCT BY ID ---------------- */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    const product = await productModel.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ product, message: "Product fetched successfully " });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ---------------- UPDATE PRODUCT ---------------- */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    const existingProduct = await productModel.getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    const updatedProduct = await productModel.updateProduct(id, req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ---------------- DELETE PRODUCT ---------------- */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    const existingProduct = await productModel.getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    await productModel.deleteProduct(id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ---------------- BULK INSERT PRODUCTS ---------------- */
export const bulkInsertProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Products array is required." });
    }

    const inserted = await productModel.bulkInsertProducts(products);

    res.status(201).json({
      inserted,
      message: "Products inserted successfully.",
    });
  } catch (error) {
    console.error("Bulk Insert Products Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ---------------- FILTERED PRODUCTS ---------------- */
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

    // ✅ TYPE CASTING
    page = Number(page);
    limit = Number(limit);

    if (minPrice !== null) minPrice = Number(minPrice);
    if (maxPrice !== null) maxPrice = Number(maxPrice);
    if (inStock !== null) inStock = inStock === "true";

    const data = await productModel.listProducts({
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
      data,
      message: Messages.PRODUCT.PRODUCTS_FETCH_SUCCESS,
    });
  } catch (error) {
    console.error("Filtered Product Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getNewarrivals = async (req, res) => {
  try {
    const newarrivals = await productModel.listNewProducts({ limit: 8 });
    res.status(200).json({
      newarrivals,
      message: Messages.PRODUCT.PRODUCTS_FETCH_SUCCESS,
    });
  } catch (error) {
    console.error("New arrival Product Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
};
