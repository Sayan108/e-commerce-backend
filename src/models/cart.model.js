import { config as cfg, dbs } from "../config/index.js";

/* ===========================
   ✅ MONGOOSE SCHEMA
=========================== */

let knex;
let mongoose;
let CartM;

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
      { timestamps: true }
    );
    CartM = mongoose.models.Cart || mongoose.model("Cart", s);
  } else {
    knex = dbHandles.knex;
  }
}

/* =====================
     ✅ ADD TO CART
  ===================== */
async function addToCart(data) {
  if (cfg.db.type === dbs.MONGODB) {
    const existing = await CartM.findOne({
      userId: data.userId,
      productId: data.productId,
    });

    if (existing) {
      existing.quantity += data.quantity || 1;
      return existing.save();
    }

    return await CartM.create(data);
  }

  // ✅ SQL (Knex)
  const existing = await knex("cart")
    .where({
      userId: data.userId,
      productId: data.productId,
    })
    .first();

  if (existing) {
    await knex("cart")
      .where({ id: existing.id })
      .update({
        quantity: existing.quantity + (data.quantity || 1),
      });

    return knex("cart").where({ id: existing.id }).first();
  }

  const [id] = await knex("cart").insert(data);
  return { id, ...data };
}
/* =====================
     ✅ GET USER CART
  ===================== */
async function getCartByUserId(userId) {
  if (cfg.db.type === dbs.MONGODB) {
    return await CartM.find({ userId }).populate("productId");
  }

  return knex("cart").where({ userId }).orderBy("createdAt", "desc");
}

/* =====================
     ✅ UPDATE QUANTITY
  ===================== */
async function updateCartItem(id, quantity) {
  if (cfg.db.type === dbs.MONGODB) {
    return await CartM.findByIdAndUpdate(id, { quantity }, { new: true });
  }

  await knex("cart").where({ id }).update({ quantity });
  return knex("cart").where({ id }).first();
}

/* =====================
     ✅ DELETE ITEM
  ===================== */
async function deleteCartItem(id) {
  if (cfg.db.type === dbs.MONGODB) {
    return await CartM.findByIdAndDelete(id);
  }

  return knex("cart").where({ id }).del();
}

/* =====================
     ✅ CLEAR CART
  ===================== */
async function clearCart(userId) {
  if (cfg.db.type === dbs.MONGODB) {
    return await CartM.deleteMany({ userId });
  }

  return knex("cart").where({ userId }).del();
}

export default {
  init,
  addToCart,
  deleteCartItem,
  updateCartItem,
  getCartByUserId,
};
