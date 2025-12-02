import { orderStatuses } from "../config/index.js";
import { Messages } from "../config/messages.js";
import orderModel from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const payload = {
      userId: req.user.id,
      items: req.body.items || [],
      total: req.body.total || 0,
      status: orderStatuses.PLACED,
    };
    const order = await orderModel.placeOrder(payload);
    res.json({ order, message: Messages.ORDER.ORDER_PLACED });
  } catch (error) {
    res.status(500).json({ error: "Order creation failed." });
  }
};
