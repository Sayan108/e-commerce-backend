import { orderStatuses } from "../../config/index.js";
import { Messages } from "../../config/messages.js";
import OrderModel, { OrderStatus } from "./order.model.js";
import ProductModel from "../products/product.model.js";
import UserModel from "../auth/user.model.js";
import AddressModel from "../address/address.model.js";
import Utils from "../../utils/index..js";
import CartModel from "../cart/cart.model.js";

class OrdersController {
  async createOrder(req, res) {
    try {
      const userId = req.user.id;

      const user = await UserModel.findById(userId);

      // ------------------ FETCH ADDRESSES ------------------
      const shippingAddress = await AddressModel.getAddressById(
        req.body.shippingAddressId
      );
      if (!shippingAddress)
        return res.status(404).json({ error: "Shipping address not found." });

      const billingAddress = await AddressModel.getAddressById(
        req.body.billingAddressId
      );
      if (!billingAddress)
        return res.status(404).json({ error: "Billing address not found." });

      // ------------------ ITEMS SOURCE ------------------
      // Option A: From request body (direct checkout)
      const bodyItems = Array.isArray(req.body.items) ? req.body.items : [];

      // Option B: From user cart (full-cart checkout)
      const cartItems = await CartModel.getCartByUserId(userId);

      const itemsToUse =
        bodyItems.length > 0
          ? bodyItems
          : cartItems.length > 0
          ? cartItems
          : [];

      if (itemsToUse.length === 0) {
        return res
          .status(400)
          .json({ error: "Order must contain at least one item." });
      }

      // ------------------ VALIDATE ITEMS ------------------
      const validation = await ProductModel.validateProducts(itemsToUse);
      if (!validation.valid) {
        return res.status(400).json({ error: "Invalid product in order." });
      }

      // ------------------ CALCULATE TOTAL ------------------
      const cartTotal = itemsToUse.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );

      // ------------------ PREPARE ORDER PAYLOAD ------------------
      const payload = {
        userId,
        items: itemsToUse,
        total: cartTotal,
        shippingAddressId: req.body.shippingAddressId,
        billingAddressId: req.body.billingAddressId,
        orderNumber: Utils.generateOrderId(),
        shippingaddress: Utils.getAddressString(shippingAddress),
        billingaddress: Utils.getAddressString(billingAddress),

        status: OrderStatus.PENDING,
      };

      // ------------------ CREATE ORDER ------------------
      const order = await OrderModel.placeOrder(payload);

      // OPTIONAL: Clear cart after full-cart checkout
      if (bodyItems.length === 0) {
        await CartModel.clearCart(userId);
      }

      return res.json({
        order,
        message: Messages.ORDER.ORDER_PLACED,
      });
    } catch (error) {
      console.error("Order creation failed:", error);
      return res.status(500).json({ error: "Order creation failed." });
    }
  }

  async getOrdersByUser(req, res) {
    try {
      const { id } = req.user;
      const { limit, page, sortBy, sortOrder } = req.body;
      if (!id) {
        return res.status(400).json({ error: "User ID is required." });
      }
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      const orders = await OrderModel.getOrdersByUserId(id, {
        limit,
        page,
        sortBy,
        sortOrder,
      });
      res.json({ orders, message: Messages.ORDER.ORDERS_FETCH_SUCCESS });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders." });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await OrderModel.getAllOrders();
      res.json({ orders, message: Messages.ORDER.ORDERS_FETCH_SUCCESS });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders." });
    }
  }

  async updateOrderStatus(req, res) {
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
      const existingOrder = await OrderModel.getOrderById(id);
      if (!existingOrder) {
        return res.status(404).json({ error: "Order not found." });
      }
      const updated = await OrderModel.updateOrderStatus(id, status);
      res.json({ updated, message: Messages.ORDER.ORDER_STATUS_UPDATED });
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status." });
    }
  }

  async updateOrderDetails(req, res) {
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

      const existingOrder = await OrderModel.getOrderById(id);
      if (!existingOrder) {
        return res.status(404).json({ error: "Order not found." });
      }
      const updated = await OrderModel.updateOrderDetails(id, req.body);
      res.json({ updated, message: Messages.ORDER.ORDER_DETAILS_UPDATED });
    } catch (error) {
      res.status(500).json({ error: "Failed to update order details." });
    }
  }
}

export default OrdersController;
