import { orderStatuses } from "../config/index.js";
import { Messages } from "../config/messages.js";
import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";

export const createOrder = async (req, res) => {
  try {
    const payload = {
      userId: req.user.id,
      items: req.body.items || [],
      total: req.body.total || 0,
      status: orderStatuses.PLACED,
    };
    const user = await userModel.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (payload.items.length === 0) {
      return res
        .status(400)
        .json({ error: "Order must contain at least one item." });
    }

    const product = await productModel.validateProducts(payload.items);
    if (!product.valid) {
      return res.status(400).json({ error: `Invalid product in order .` });
    }
    const order = await orderModel.placeOrder(payload);
    res.json({ order, message: Messages.ORDER.ORDER_PLACED });
  } catch (error) {
    res.status(500).json({ error: "Order creation failed." });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const orders = await orderModel.getOrdersByUserId(id);
    res.json({ orders, message: Messages.ORDER.ORDERS_FETCH_SUCCESS });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.json({ orders, message: Messages.ORDER.ORDERS_FETCH_SUCCESS });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }
    if (!id) {
      return res.status(400).json({ error: "Order ID is required." });
    }
    if (!Object.values(orderStatuses).includes(status)) {
      return res.status(400).json({ error: "Invalid order status." });
    }
    const existingOrder = await orderModel.getOrderById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found." });
    }
    const updated = await orderModel.updateOrderStatus(id, status);
    res.json({ updated, message: Messages.ORDER.ORDER_STATUS_UPDATED });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status." });
  }
};

export const updateOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.status) {
      return res.status(400).json({
        error: "Use the status update endpoint to change order status.",
      });
    }
    if (!id) {
      return res.status(400).json({ error: "Order ID is required." });
    }
    if (!Object.values(orderStatuses).includes(status)) {
      return res.status(400).json({ error: "Invalid order status." });
    }
    const existingOrder = await orderModel.getOrderById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found." });
    }
    const updated = await orderModel.updateOrderDetails(id, req.body);
    res.json({ updated, message: Messages.ORDER.ORDER_DETAILS_UPDATED });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order details." });
  }
};
