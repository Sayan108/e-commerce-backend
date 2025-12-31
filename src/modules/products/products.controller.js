import { Messages } from "../../config/messages.js";
import ProductModel from "./product.model.js";

class ProductsController {
  /* ---------------- CREATE PRODUCT ---------------- */
  async createProducts(req, res) {
    try {
      const product = await ProductModel.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error("Create Product Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /* ---------------- GET ALL PRODUCTS ---------------- */
  async getAllProducts(req, res) {
    try {
      const list = await ProductModel.listProducts();
      res.status(200).json(list);
    } catch (error) {
      console.error("Get All Products Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /* ---------------- GET PRODUCT BY ID ---------------- */
  async getProductById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Product ID is required." });
      }

      const product = await ProductModel.getProductById(id);

      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }

      res
        .status(200)
        .json({ product, message: "Product fetched successfully " });
    } catch (error) {
      console.error("Get Product By ID Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /* ---------------- UPDATE PRODUCT ---------------- */
  async updateProduct(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Product ID is required." });
      }

      const existingProduct = await ProductModel.getProductById(id);

      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found." });
      }

      const updatedProduct = await ProductModel.updateProduct(id, req.body);
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Update Product Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /* ---------------- DELETE PRODUCT ---------------- */
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Product ID is required." });
      }

      const existingProduct = await ProductModel.getProductById(id);

      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found." });
      }

      await ProductModel.deleteProduct(id);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Delete Product Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /* ---------------- BULK INSERT PRODUCTS ---------------- */
  async bulkInsertProducts(req, res) {
    try {
      const { products } = req.body;

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "Products array is required." });
      }

      const inserted = await ProductModel.bulkInsertProducts(products);

      res.status(201).json({
        inserted,
        message: "Products inserted successfully.",
      });
    } catch (error) {
      console.error("Bulk Insert Products Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /* ---------------- FILTERED PRODUCTS ---------------- */
  async getProductsByCategoriesWithFilter(req, res) {
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

      const data = await ProductModel.listProducts({
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
  }

  async getNewarrivals(req, res) {
    try {
      const newarrivals = await ProductModel.listNewProducts({ limit: 8 });
      res.status(200).json({
        data: newarrivals,
        pagination: {
          total: 10,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        message: Messages.PRODUCT.PRODUCTS_FETCH_SUCCESS,
      });
    } catch (error) {
      console.error("New arrival Product Fetch Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default ProductsController;
