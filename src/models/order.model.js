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
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },

            thumbnail: String,
            itemname: { type: String, required: true },

            quantity: {
              type: Number,
              default: 1,
              min: 1,
            },
            price: { type: Number, required: true },
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

async function getOrdersByUserId(
  userId,
  {
    page = 1,
    limit = 10,
    sortBy = "createdAt", // "createdAt" | "status"
    sortOrder = "desc", // "asc" | "desc"
  } = {}
) {
  page = Number(page);
  limit = Math.min(Number(limit), 100); // safety cap
  const skip = (page - 1) * limit;

  /* ---------------------- MONGODB ---------------------- */
  if (cfg.db.type === dbs.MONGODB) {
    const filter = { userId };

    const sort = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const [data, total] = await Promise.all([
      OrderM.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      OrderM.countDocuments(filter),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /* ------------------------ SQL / KNEX ------------------------ */

  const query = knex("orders").where({ userId });

  const countQuery = query.clone().count("* as count").first();

  const dataQuery = query
    .clone()
    .orderBy(sortBy, sortOrder)
    .limit(limit)
    .offset(skip)
    .select("*");

  const [data, countResult] = await Promise.all([dataQuery, countQuery]);

  const total = Number(countResult.count);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
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
