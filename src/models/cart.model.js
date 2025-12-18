import { config as cfg, dbs } from "../config/index.js";

let knex;
let mongoose;
let CartM;

async function init(dbHandles) {
  if (cfg.db.type === dbs.MONGODB) {
    mongoose = dbHandles.mongoose;

    const schema = new mongoose.Schema(
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

    CartM = mongoose.models.Cart || mongoose.model("Cart", schema);
  } else {
    knex = dbHandles.knex;
  }
}

/* -------------------- SHARED SELECT -------------------- */
const CART_FIELDS = "_id userId productId thumbnail itemname quantity price";

/* -------------------- ADD TO CART -------------------- */
async function addToCart(data) {
  const qty = Math.max(1, data.quantity || 1);

  if (cfg.db.type === dbs.MONGODB) {
    const existing = await CartM.findOne({
      userId: data.userId,
      productId: data.productId,
    });

    if (existing) {
      existing.quantity += qty;
      const saved = await existing.save();
      return saved.toObject({
        transform: (_, ret) => {
          delete ret.__v;
          delete ret.createdAt;
          delete ret.updatedAt;
          return ret;
        },
      });
    }

    const doc = await CartM.create({ ...data, quantity: qty });
    return {
      _id: doc._id,
      userId: doc.userId,
      productId: doc.productId,
      thumbnail: doc.thumbnail,
      itemname: doc.itemname,
      quantity: doc.quantity,
      price: doc.price,
    };
  }

  // ---------- SQL ----------
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
        quantity: existing.quantity + qty,
      });

    return knex("cart")
      .where({ id: existing.id })
      .select(
        "id as _id",
        "userId",
        "productId",
        "thumbnail",
        "itemname",
        "quantity",
        "price"
      )
      .first();
  }

  const [id] = await knex("cart").insert({
    ...data,
    quantity: qty,
  });

  return {
    _id: id,
    userId: data.userId,
    productId: data.productId,
    thumbnail: data.thumbnail,
    itemname: data.itemname,
    quantity: qty,
    price: data.price,
  };
}

/* -------------------- GET USER CART -------------------- */
async function getCartByUserId(userId) {
  if (cfg.db.type === dbs.MONGODB) {
    return CartM.find({ userId }).select(CART_FIELDS).lean();
  }

  return knex("cart")
    .where({ userId })
    .orderBy("createdAt", "desc")
    .select(
      "id as _id",
      "userId",
      "productId",
      "thumbnail",
      "itemname",
      "quantity",
      "price"
    );
}

/* -------------------- UPDATE QUANTITY -------------------- */
async function updateCartItem(id, quantity) {
  const qty = Math.max(1, quantity);

  if (cfg.db.type === dbs.MONGODB) {
    return CartM.findByIdAndUpdate(id, { quantity: qty }, { new: true })
      .select(CART_FIELDS)
      .lean();
  }

  await knex("cart").where({ id }).update({ quantity: qty });

  return knex("cart")
    .where({ id })
    .select(
      "id as _id",
      "userId",
      "productId",
      "thumbnail",
      "itemname",
      "quantity",
      "price"
    )
    .first();
}

/* -------------------- DELETE ITEM -------------------- */
async function deleteCartItem(id) {
  if (cfg.db.type === dbs.MONGODB) {
    return CartM.findByIdAndDelete(id)?.select(CART_FIELDS)?.lean();
  }

  return knex("cart").where({ id }).del();
}

/* -------------------- CLEAR CART -------------------- */
async function clearCart(userId) {
  if (cfg.db.type === dbs.MONGODB) {
    return CartM.deleteMany({ userId });
  }

  return knex("cart").where({ userId }).del();
}

export default {
  init,
  addToCart,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
  clearCart,
};
