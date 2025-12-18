import { config as cfg, dbs, sqlTableNames } from "../config/index.js";

let knex;
let mongoose;

let BannerM;
let VideoM;
let ContactUsM;
let FaqM;

/* ===========================
        INIT
=========================== */
async function init(dbHandles) {
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
=========================== */
const BANNER_FIELDS =
  "_id name description link imageurl ctaButtonTitle subFeatures";
const VIDEO_FIELDS = "_id title description videolink thumbnail";
const FAQ_FIELDS = "_id question answer";

/* ===========================
        BANNER CRUD
=========================== */
async function createDashBoardBanner(data) {
  if (cfg.db.type === dbs.MONGODB) {
    const doc = await BannerM.create(data);
    return BannerM.findById(doc._id).select(BANNER_FIELDS).lean();
  }

  const [id] = await knex(sqlTableNames.DASHBOARDDATA).insert(data);
  return knex(sqlTableNames.DASHBOARDDATA).where({ id }).select("*").first();
}

async function listDashBoardBanners() {
  if (cfg.db.type === dbs.MONGODB) {
    return BannerM.find().select(BANNER_FIELDS).lean();
  }

  return knex(sqlTableNames.DASHBOARDDATA).select("*");
}

async function getDashBoardBanner(id) {
  if (cfg.db.type === dbs.MONGODB) {
    return BannerM.findById(id).select(BANNER_FIELDS).lean();
  }

  return knex(sqlTableNames.DASHBOARDDATA).where({ id }).first();
}

async function updateDashBoardBanner(id, changes) {
  if (cfg.db.type === dbs.MONGODB) {
    return BannerM.findByIdAndUpdate(id, changes, { new: true })
      .select(BANNER_FIELDS)
      .lean();
  }

  await knex(sqlTableNames.DASHBOARDDATA).where({ id }).update(changes);
  return knex(sqlTableNames.DASHBOARDDATA).where({ id }).first();
}

async function deleteDashBoardBanner(id) {
  if (cfg.db.type === dbs.MONGODB) {
    return BannerM.findByIdAndDelete(id).select("_id").lean();
  }

  return knex(sqlTableNames.DASHBOARDDATA).where({ id }).del();
}

/* ===========================
        VIDEO CRUD
=========================== */
async function createDashboardVideo(data) {
  if (cfg.db.type === dbs.MONGODB) {
    const doc = await VideoM.create(data);
    return VideoM.findById(doc._id).select(VIDEO_FIELDS).lean();
  }

  const [id] = await knex("dashboard_videos").insert(data);
  return knex("dashboard_videos").where({ id }).first();
}

async function listDashboardVideos() {
  if (cfg.db.type === dbs.MONGODB) {
    return VideoM.find().select(VIDEO_FIELDS).lean();
  }

  return knex("dashboard_videos").select("*");
}

async function getDashboardVideo(id) {
  if (cfg.db.type === dbs.MONGODB) {
    return VideoM.findById(id).select(VIDEO_FIELDS).lean();
  }

  return knex("dashboard_videos").where({ id }).first();
}

async function updateDashboardVideo(id, changes) {
  if (cfg.db.type === dbs.MONGODB) {
    return VideoM.findByIdAndUpdate(id, changes, { new: true })
      .select(VIDEO_FIELDS)
      .lean();
  }

  await knex("dashboard_videos").where({ id }).update(changes);
  return knex("dashboard_videos").where({ id }).first();
}

async function deleteDashboardVideo(id) {
  if (cfg.db.type === dbs.MONGODB) {
    return VideoM.findByIdAndDelete(id).select("_id").lean();
  }

  return knex("dashboard_videos").where({ id }).del();
}

/* ===========================
      CONTACT US (SINGLETON)
=========================== */
async function createOrUpdateContactUsInfo(data) {
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

async function getContactUsInfo() {
  if (cfg.db.type === dbs.MONGODB) {
    return ContactUsM.findOne().lean();
  }

  return knex("contact_us_info").first();
}

/* ===========================
            FAQ
=========================== */
async function createFaq(data) {
  if (cfg.db.type === dbs.MONGODB) {
    const doc = await FaqM.create(data);
    return FaqM.findById(doc._id).select(FAQ_FIELDS).lean();
  }

  const [id] = await knex(sqlTableNames.FAQ).insert(data);
  return knex(sqlTableNames.FAQ).where({ id }).first();
}

async function listFaqs() {
  if (cfg.db.type === dbs.MONGODB) {
    return FaqM.find().sort({ createdAt: -1 }).select(FAQ_FIELDS).lean();
  }

  return knex(sqlTableNames.FAQ).select("*").orderBy("created_at", "desc");
}

async function deleteFaq(id) {
  if (cfg.db.type === dbs.MONGODB) {
    return FaqM.findByIdAndDelete(id).select("_id").lean();
  }

  return knex(sqlTableNames.FAQ).where({ id }).del();
}

async function bulkInsertFaqs(faqs) {
  if (!Array.isArray(faqs) || faqs.length === 0) return [];

  if (cfg.db.type === dbs.MONGODB) {
    await FaqM.insertMany(faqs, { ordered: false });
    return FaqM.find().select(FAQ_FIELDS).lean();
  }

  await knex(sqlTableNames.FAQ).insert(faqs);
  return knex(sqlTableNames.FAQ).select("*");
}

/* ===========================
        EXPORT
=========================== */
export default {
  init,

  // Banner
  createDashBoardBanner,
  listDashBoardBanners,
  getDashBoardBanner,
  updateDashBoardBanner,
  deleteDashBoardBanner,

  // Video
  createDashboardVideo,
  listDashboardVideos,
  getDashboardVideo,
  updateDashboardVideo,
  deleteDashboardVideo,

  // Contact
  createOrUpdateContactUsInfo,
  getContactUsInfo,

  // FAQ
  createFaq,
  listFaqs,
  bulkInsertFaqs,
  deleteFaq,
};
