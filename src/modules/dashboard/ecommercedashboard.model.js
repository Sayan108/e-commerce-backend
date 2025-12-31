import { config as cfg, dbs, sqlTableNames } from "../../config/index.js";

let knex;
let mongoose;

let BannerM;
let VideoM;
let ContactUsM;
let FaqM;

/* ===========================
        INIT
=========================== */
class EcommerceDashboardModel {
  static async init(dbHandles) {
    if (cfg.db.type === dbs.MONGODB) {
      mongoose = dbHandles.mongoose;

      const bannerSchema = new mongoose.Schema(
        {
          name: String,
          description: String,
          link: String,
          imageurl: String,
          ctaButtonTitle: String,
          subFeatures: [String],
        },
        { timestamps: true }
      );

      const videoSchema = new mongoose.Schema(
        {
          title: String,
          description: String,
          videolink: String,
          thumbnail: String,
        },
        { timestamps: true }
      );

      const contactSchema = new mongoose.Schema(
        {
          email: String,
          phone: String,
          address: String,
          contactusEmail: String,
        },
        { timestamps: true }
      );

      const faqSchema = new mongoose.Schema(
        {
          question: String,
          answer: String,
        },
        { timestamps: true }
      );

      BannerM =
        mongoose.models.DashboardBanner ||
        mongoose.model("DashboardData", bannerSchema);

      VideoM =
        mongoose.models.DashboardVideo ||
        mongoose.model("DashboardVideo", videoSchema);

      ContactUsM =
        mongoose.models.ContactUsInfo ||
        mongoose.model("ContactUsInfo", contactSchema);

      FaqM = mongoose.models.FAQ || mongoose.model("FAQ", faqSchema);
    } else {
      knex = dbHandles.knex;
    }
  }

  /* ===========================
        SHARED FIELDS
  ============================ */
  static get BANNER_FIELDS() {
    return "_id name description link imageurl ctaButtonTitle subFeatures";
  }

  static get VIDEO_FIELDS() {
    return "_id title description videolink thumbnail";
  }

  static get FAQ_FIELDS() {
    return "_id question answer";
  }

  /* ===========================
        BANNER CRUD
  ============================ */
  static async createDashBoardBanner(data) {
    if (cfg.db.type === dbs.MONGODB) {
      const doc = await BannerM.create(data);
      return BannerM.findById(doc._id).select(this.BANNER_FIELDS).lean();
    }

    const [id] = await knex(sqlTableNames.DASHBOARDDATA).insert(data);
    return knex(sqlTableNames.DASHBOARDDATA).where({ id }).select("*").first();
  }

  static async listDashBoardBanners() {
    if (cfg.db.type === dbs.MONGODB) {
      return BannerM.find().select(this.BANNER_FIELDS).lean();
    }

    return knex(sqlTableNames.DASHBOARDDATA).select("*");
  }

  static async getDashBoardBanner(id) {
    if (cfg.db.type === dbs.MONGODB) {
      return BannerM.findById(id).select(this.BANNER_FIELDS).lean();
    }

    return knex(sqlTableNames.DASHBOARDDATA).where({ id }).first();
  }

  static async updateDashBoardBanner(id, changes) {
    if (cfg.db.type === dbs.MONGODB) {
      return BannerM.findByIdAndUpdate(id, changes, { new: true })
        .select(this.BANNER_FIELDS)
        .lean();
    }

    await knex(sqlTableNames.DASHBOARDDATA).where({ id }).update(changes);
    return knex(sqlTableNames.DASHBOARDDATA).where({ id }).first();
  }

  static async deleteDashBoardBanner(id) {
    if (cfg.db.type === dbs.MONGODB) {
      return BannerM.findByIdAndDelete(id).select("_id").lean();
    }

    return knex(sqlTableNames.DASHBOARDDATA).where({ id }).del();
  }

  /* ===========================
        VIDEO CRUD
  ============================ */
  static async createDashboardVideo(data) {
    if (cfg.db.type === dbs.MONGODB) {
      const doc = await VideoM.create(data);
      return VideoM.findById(doc._id).select(this.VIDEO_FIELDS).lean();
    }

    const [id] = await knex("dashboard_videos").insert(data);
    return knex("dashboard_videos").where({ id }).first();
  }

  static async listDashboardVideos() {
    if (cfg.db.type === dbs.MONGODB) {
      return VideoM.find().select(this.VIDEO_FIELDS).lean();
    }

    return knex("dashboard_videos").select("*");
  }

  static async getDashboardVideo(id) {
    if (cfg.db.type === dbs.MONGODB) {
      return VideoM.findById(id).select(this.VIDEO_FIELDS).lean();
    }

    return knex("dashboard_videos").where({ id }).first();
  }

  static async updateDashboardVideo(id, changes) {
    if (cfg.db.type === dbs.MONGODB) {
      return VideoM.findByIdAndUpdate(id, changes, { new: true })
        .select(this.VIDEO_FIELDS)
        .lean();
    }

    await knex("dashboard_videos").where({ id }).update(changes);
    return knex("dashboard_videos").where({ id }).first();
  }

  static async deleteDashboardVideo(id) {
    if (cfg.db.type === dbs.MONGODB) {
      return VideoM.findByIdAndDelete(id).select("_id").lean();
    }

    return knex("dashboard_videos").where({ id }).del();
  }

  /* ===========================
      CONTACT US (SINGLETON)
  ============================ */
  static async createOrUpdateContactUsInfo(data) {
    if (cfg.db.type === dbs.MONGODB) {
      const existing = await ContactUsM.findOne();

      if (existing) {
        return ContactUsM.findByIdAndUpdate(existing._id, data, {
          new: true,
        }).lean();
      }

      return ContactUsM.create(data);
    }

    const existing = await knex("contact_us_info").first();

    if (existing) {
      await knex("contact_us_info").where({ id: existing.id }).update(data);
      return knex("contact_us_info").where({ id: existing.id }).first();
    }

    const [id] = await knex("contact_us_info").insert(data);
    return knex("contact_us_info").where({ id }).first();
  }

  static async getContactUsInfo() {
    if (cfg.db.type === dbs.MONGODB) {
      return ContactUsM.findOne().lean();
    }

    return knex("contact_us_info").first();
  }

  /* ===========================
            FAQ
  ============================ */
  static async createFaq(data) {
    if (cfg.db.type === dbs.MONGODB) {
      const doc = await FaqM.create(data);
      return FaqM.findById(doc._id).select(this.FAQ_FIELDS).lean();
    }

    const [id] = await knex(sqlTableNames.FAQ).insert(data);
    return knex(sqlTableNames.FAQ).where({ id }).first();
  }

  static async listFaqs() {
    if (cfg.db.type === dbs.MONGODB) {
      return FaqM.find().sort({ createdAt: -1 }).select(this.FAQ_FIELDS).lean();
    }

    return knex(sqlTableNames.FAQ).select("*").orderBy("created_at", "desc");
  }

  static async deleteFaq(id) {
    if (cfg.db.type === dbs.MONGODB) {
      return FaqM.findByIdAndDelete(id).select("_id").lean();
    }

    return knex(sqlTableNames.FAQ).where({ id }).del();
  }

  static async bulkInsertFaqs(faqs) {
    if (!Array.isArray(faqs) || faqs.length === 0) return [];

    if (cfg.db.type === dbs.MONGODB) {
      await FaqM.insertMany(faqs, { ordered: false });
      return FaqM.find().select(this.FAQ_FIELDS).lean();
    }

    await knex(sqlTableNames.FAQ).insert(faqs);
    return knex(sqlTableNames.FAQ).select("*");
  }
}

export default EcommerceDashboardModel;
