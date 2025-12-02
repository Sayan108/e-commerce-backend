import { orderStatuses } from "../config/index.js";
import orderModel from "../models/order.model.js";

export const createOrder = async (req, res) => {
  const payload = {
    userId: req.user.id,
    items: req.body.items || [],
    total: req.body.total || 0,
    status: orderStatuses.PLACED,
  };
  const order = await orderModel.placeOrder(payload);
  res.json(order);
};
