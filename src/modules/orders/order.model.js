import { config as cfg, dbs } from "../../config/index.js";

let knex;
let mongoose;
let OrderM;

/* ===========================
        CONSTANTS
=========================== */
export const OrderStatus = {
  PENDING: "pending",
  PAID: "paid",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

class OrderModel {
  /* ===========================
        INIT
  ============================ */
  static async init(dbHandles) {
    if (cfg.db.type === dbs.MONGODB) {
      mongoose = dbHandles.mongoose;

      const orderItemSchema = new mongoose.Schema(
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          thumbnail: String,
          itemname: { type: String, required: true },
          quantity: { type: Number, min: 1, default: 1 },
          price: { type: Number, required: true },
        },
        { _id: false }
      );

      const orderSchema = new mongoose.Schema(
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },

          orderNumber: { type: String, unique: true, required: true },

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

          shippingaddress: { type: String, required: true },
          billingaddress: { type: String, required: true },

          items: [orderItemSchema],

          total: { type: Number, required: true },

          status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
          },
        },
        { timestamps: true }
      );

      OrderM = mongoose.models.Order || mongoose.model("Order", orderSchema);
    } else {
      knex = dbHandles.knex;
    }
  }

  /* ===========================
      COMMON SELECT FIELDS
  ============================ */
  static get ORDER_FIELDS() {
    return "_id userId items total status shippingaddress billingaddress createdAt orderNumber";
  }

  /* ===========================
        PLACE ORDER
  ============================ */
  static async placeOrder(order) {
    if (cfg.db.type === dbs.MONGODB) {
      const doc = await OrderM.create(order);
      return OrderM.findById(doc._id).select(this.ORDER_FIELDS).lean();
    }

    const [id] = await knex("orders").insert(order);
    return knex("orders").where({ id }).first();
  }

  /* ===========================
      PURCHASE CHECK
  ============================ */
  static async userHasPurchased(userId, productId) {
    if (cfg.db.type === dbs.MONGODB) {
      return (
        (await OrderM.countDocuments({
          userId,
          "items.productId": productId,
        })) > 0
      );
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

  /* ===========================
      UPDATE STATUS
=========================== */
  static async updateOrderStatus(orderId, status) {
    if (!Object.values(OrderStatus).includes(status)) {
      throw new Error("Invalid order status");
    }

    if (cfg.db.type === dbs.MONGODB) {
      return OrderM.findByIdAndUpdate(orderId, { status }, { new: true })
        .select(this.ORDER_FIELDS)
        .lean();
    }

    await knex("orders").where({ id: orderId }).update({ status });
    return knex("orders").where({ id: orderId }).first();
  }

  /* ===========================
      UPDATE ORDER
=========================== */
  static async updateOrderDetails(orderId, details) {
    if (cfg.db.type === dbs.MONGODB) {
      return OrderM.findByIdAndUpdate(orderId, details, { new: true })
        .select(this.ORDER_FIELDS)
        .lean();
    }

    await knex("orders").where({ id: orderId }).update(details);
    return knex("orders").where({ id: orderId }).first();
  }

  /* ===========================
      USER ORDERS (PAGINATED)
=========================== */
  static async getOrdersByUserId(
    userId,
    { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = {}
  ) {
    page = Number(page);
    limit = Math.min(Number(limit), 100);
    const skip = (page - 1) * limit;

    /* ---------- MongoDB ---------- */
    if (cfg.db.type === dbs.MONGODB) {
      const filter = { userId };
      const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

      const [data, total] = await Promise.all([
        OrderM.find(filter)
          .select(this.ORDER_FIELDS)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
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

    /* ---------- SQL ---------- */
    const base = knex("orders").where({ userId });

    const [data, count] = await Promise.all([
      base
        .clone()
        .orderBy(sortBy, sortOrder)
        .limit(limit)
        .offset(skip)
        .select("*"),
      base.clone().count("* as count").first(),
    ]);

    const total = Number(count.count);

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

  /* ===========================
      ADMIN HELPERS
=========================== */
  static async getOrderById(orderId) {
    if (cfg.db.type === dbs.MONGODB) {
      return OrderM.findById(orderId).select(this.ORDER_FIELDS).lean();
    }
    return knex("orders").where({ id: orderId }).first();
  }

  static async getAllOrders() {
    if (cfg.db.type === dbs.MONGODB) {
      return OrderM.find().select(this.ORDER_FIELDS).lean();
    }
    return knex("orders").select("*");
  }
}

export default OrderModel;
