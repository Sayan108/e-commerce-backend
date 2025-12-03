import { config as cfg, dbs } from "../config/index.js";

let knex;
let mongoose;
let AddressM;

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
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
      },
      { timestamps: true }
    );
    AddressM = mongoose.models.Address || mongoose.model("Address", s);
  } else {
    knex = dbHandles.knex;
  }
}

async function createAddress(data) {
  if (cfg.db.type === dbs.MONGODB) return AddressM.create(data);
  const [id] = await knex("addresses")
    .insert(data)
    .returning("id")
    .catch(async (err) => {
      if (err && err.message && err.message.indexOf("RETURNING") !== -1) {
        const res = await knex("addresses").insert(data);
        return [res[0]];
      }
      throw err;
    });
  return knex("addresses").where({ id }).first();
}

async function listAddressesByUserId(userId) {
  if (cfg.db.type === dbs.MONGODB) return AddressM.find().where({ userId });
  return knex("addresses").select("*").where({ userId });
}

async function updateAddress(addressId, data) {
  if (cfg.db.type === dbs.MONGODB) {
    return AddressM.findByIdAndUpdate(addressId, data, { new: true });
  }
  await knex("addresses").where({ id: addressId }).update(data);
  return knex("addresses").where({ id: addressId }).first();
}

async function deleteAddress(addressId) {
  if (cfg.db.type === dbs.MONGODB) {
    return AddressM.findByIdAndDelete(addressId);
  }
  return knex("addresses").where({ id: addressId }).del();
}

async function getAddressById(addressId) {
  if (cfg.db.type === dbs.MONGODB) {
    return AddressM.findById(addressId);
  }
  return knex("addresses").where({ id: addressId }).first();
}

export default {
  init,
  createAddress,
  listAddressesByUserId,
  updateAddress,
  deleteAddress,
  getAddressById,
};
