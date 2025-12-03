import { config as cfg, dbs } from "../config/index.js";

let knex;
let mongoose;
let OrderM;

async function init(dbHandles) {
  if (cfg.db.type === dbs.MONGODB) {
    mongoose = dbHandles.mongoose;
    const s = new mongoose.Schema(
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        shippingAddressId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Address",
          required: true,
        },
        billingAddressId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Address",
          required: true,
        },
        billingaddress: { type: String, required: true },
        shippingaddress: { type: String, required: true },
        items: [
          {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            qty: Number,
            price: Number,
            productName: String,
          },
        ],
        total: Number,
        status: String,
      },
      { timestamps: true }
    );
    OrderM = mongoose.models.Order || mongoose.model("Order", s);
  } else {
    knex = dbHandles.knex;
  }
}

async function placeOrder(order) {
  if (cfg.db.type === dbs.MONGODB) return OrderM.create(order);
  const [id] = await knex("orders")
    .insert(order)
    .returning("id")
    .catch(async (err) => {
      if (err && err.message && err.message.indexOf("RETURNING") !== -1) {
        const res = await knex("orders").insert(order);
        return [res[0]];
      }
      throw err;
    });
  return knex("orders").where({ id }).first();
}

async function userHasPurchased(userId, productId) {
  if (cfg.db.type === dbs.MONGODB) {
    const count = await OrderM.countDocuments({
      userId,
      "items.productId": productId,
    });
    return count > 0;
  }
  const rows = await knex("orders")
    .where({ userId })
    .andWhereRaw(
      "EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id = orders.id AND oi.product_id = ?)",
      [productId]
    )
    .limit(1);
  return rows.length > 0;
}

async function updateOrderStatus(orderId, status) {
  if (cfg.db.type === dbs.MONGODB) {
    return OrderM.findByIdAndUpdate(orderId, { status }, { new: true });
  }
  await knex("orders").where({ id: orderId }).update({ status });
  return knex("orders").where({ id: orderId }).first();
}

async function updateOrderDetails(orderId, details) {
  if (cfg.db.type === dbs.MONGODB) {
    return OrderM.findByIdAndUpdate(orderId, details, { new: true });
  }
  await knex("orders").where({ id: orderId }).update(details);
  return knex("orders").where({ id: orderId }).first();
}

async function getOrdersByUserId(userId) {
  if (cfg.db.type === dbs.MONGODB) {
    return OrderM.find().where({ userId });
  }
  return knex("orders").where({ userId });
}

async function getOrderById(orderId) {
  if (cfg.db.type === dbs.MONGODB) {
    return OrderM.findById(orderId);
  }
  return knex("orders").where({ id: orderId }).first();
}

async function getAllOrders() {
  if (cfg.db.type === dbs.MONGODB) {
    return OrderM.find();
  }
  return knex("orders");
}

export default {
  init,
  placeOrder,
  userHasPurchased,
  updateOrderStatus,
  updateOrderDetails,
  getOrdersByUserId,
  getAllOrders,
};
