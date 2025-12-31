import { config as cfg, dbs } from "../../config/index.js";

let knex;
let mongoose;
let AddressM;

export const AddressType = {
  HOME: "home",
  OFFICE: "office",
  OTHER: "other",
};

class AddressModel {
  static async init(dbHandles) {
    if (cfg.db.type === dbs.MONGODB) {
      mongoose = dbHandles.mongoose;

      const schema = new mongoose.Schema(
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          addressType: {
            type: String,
            enum: Object.values(AddressType),
            default: AddressType.HOME,
            required: true,
          },
          lineOne: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String, required: true },
          zip: { type: String, required: true },
          country: { type: String, required: true },
        },
        { timestamps: true }
      );

      AddressM = mongoose.models.Address || mongoose.model("Address", schema);
    } else {
      knex = dbHandles.knex;
    }
  }

  /* -------------------- CREATE -------------------- */
  static async createAddress(data) {
    if (cfg.db.type === dbs.MONGODB) {
      const doc = await AddressM.create(data);
      return {
        _id: doc._id,
        userId: doc.userId,
        addressType: doc.addressType,
        lineOne: doc.lineOne,
        city: doc.city,
        state: doc.state,
        zip: doc.zip,
        country: doc.country,
      };
    }

    const [id] = await knex("addresses")
      .insert(data)
      .returning("id")
      .catch(async (err) => {
        if (err?.message?.includes("RETURNING")) {
          const res = await knex("addresses").insert(data);
          return [res[0]];
        }
        throw err;
      });

    return knex("addresses")
      .where({ id })
      .select(
        "id as _id",
        "userId",
        "addressType",
        "lineOne",
        "city",
        "state",
        "zip",
        "country"
      )
      .first();
  }

  /* -------------------- LIST BY USER -------------------- */
  static async listAddressesByUserId(userId) {
    if (cfg.db.type === dbs.MONGODB) {
      return AddressM.find({ userId })
        .select("_id userId addressType lineOne city state zip country")
        .lean();
    }

    return knex("addresses")
      .where({ userId })
      .select(
        "id as _id",
        "userId",
        "addressType",
        "lineOne",
        "city",
        "state",
        "zip",
        "country"
      );
  }

  /* -------------------- GET BY ID -------------------- */
  static async getAddressById(addressId) {
    if (cfg.db.type === dbs.MONGODB) {
      return AddressM.findById(addressId)
        .select("_id userId addressType lineOne city state zip country")
        .lean();
    }

    return knex("addresses")
      .where({ id: addressId })
      .select(
        "id as _id",
        "userId",
        "addressType",
        "lineOne",
        "city",
        "state",
        "zip",
        "country"
      )
      .first();
  }

  /* -------------------- UPDATE -------------------- */
  static async updateAddress(addressId, data) {
    if (cfg.db.type === dbs.MONGODB) {
      return AddressM.findByIdAndUpdate(addressId, data, {
        new: true,
      })
        .select("_id userId addressType lineOne city state zip country")
        .lean();
    }

    await knex("addresses").where({ id: addressId }).update(data);

    return knex("addresses")
      .where({ id: addressId })
      .select(
        "id as _id",
        "userId",
        "addressType",
        "lineOne",
        "city",
        "state",
        "zip",
        "country"
      )
      .first();
  }

  /* -------------------- DELETE -------------------- */
  static async deleteAddress(addressId) {
    if (cfg.db.type === dbs.MONGODB) {
      return AddressM.findByIdAndDelete(addressId)
        ?.select("_id userId addressType lineOne city state zip country")
        ?.lean();
    }

    return knex("addresses").where({ id: addressId }).del();
  }
}

export default AddressModel;
