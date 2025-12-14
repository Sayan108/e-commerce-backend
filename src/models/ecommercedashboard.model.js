import { config as cfg, dbs, sqlTableNames } from "../config/index.js";

let knex;
let mongoose;
let ProductM;
let VideoM;
let ContactUsInfoM;
let faqM;

async function init(dbHandles) {
  if (cfg.db.type === dbs.MONGODB) {
    mongoose = dbHandles.mongoose;

    // Banner Schema
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

    // Video Schema
    const videoSchema = new mongoose.Schema(
      {
        title: String,
        description: String,
        videolink: String,
        thumbnail: String,
      },
      { timestamps: true }
    );
    // contactus schema
    const contactUsInfoSchema = new mongoose.Schema(
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
    ContactUsInfoM =
      mongoose.models.ContactUsData ||
      mongoose.model("ContactUsData", contactUsInfoSchema);
    faqM = mongoose.models.FAQ || mongoose.model("FAQ", faqSchema);
    ProductM =
      mongoose.models.Dashboarddata ||
      mongoose.model("Dashboarddata", bannerSchema);

    VideoM =
      mongoose.models.DashboardVideo ||
      mongoose.model("DashboardVideo", videoSchema);
  } else {
    knex = dbHandles.knex;
  }
}

/* ===================== BANNER CRUD ===================== */

async function createDashBoardBanner(data) {
  if (cfg.db.type === dbs.MONGODB) return ProductM.create(data);

  const [id] = await knex(sqlTableNames.DASHBOARDDATA)
    .insert(data)
    .returning("id")
    .catch(async (err) => {
      if (err?.message?.includes("RETURNING")) {
        const res = await knex("dashboarddata").insert(data);
        return [res[0]];
      }
      throw err;
    });

  return knex("dashboarddata").where({ id }).first();
}

async function listDashBoardBanners() {
  if (cfg.db.type === dbs.MONGODB) return ProductM.find().lean();
  return knex("dashboarddata").select("*");
}

async function getDashBoardBanner(id) {
  if (cfg.db.type === dbs.MONGODB) return ProductM.findById(id).lean();
  return knex("dashboarddata").where({ id }).first();
}

async function updateDashBoardBanner(id, changes) {
  if (cfg.db.type === dbs.MONGODB)
    return ProductM.findByIdAndUpdate(id, changes, { new: true }).lean();

  await knex("dashboarddata").where({ id }).update(changes);
  return knex("dashboarddata").where({ id }).first();
}

async function deleteDashBoardBanner(id) {
  if (cfg.db.type === dbs.MONGODB) return ProductM.findByIdAndDelete(id);

  return knex("dashboarddata").where({ id }).del();
}

/* ===================== VIDEO CRUD ===================== */

async function createDashboardVideo(data) {
  if (cfg.db.type === dbs.MONGODB) return VideoM.create(data);

  const [id] = await knex("dashboard_videos")
    .insert(data)
    .returning("id")
    .catch(async (err) => {
      if (err?.message?.includes("RETURNING")) {
        const res = await knex("dashboard_videos").insert(data);
        return [res[0]];
      }
      throw err;
    });

  return knex("dashboard_videos").where({ id }).first();
}

async function listDashboardVideos() {
  if (cfg.db.type === dbs.MONGODB) return VideoM.find().lean();

  return knex("dashboard_videos").select("*");
}

async function getDashboardVideo(id) {
  if (cfg.db.type === dbs.MONGODB) return VideoM.findById(id).lean();

  return knex("dashboard_videos").where({ id }).first();
}

async function updateDashboardVideo(id, changes) {
  if (cfg.db.type === dbs.MONGODB)
    return VideoM.findByIdAndUpdate(id, changes, { new: true }).lean();

  await knex("dashboard_videos").where({ id }).update(changes);
  return knex("dashboard_videos").where({ id }).first();
}

async function deleteDashboardVideo(id) {
  if (cfg.db.type === dbs.MONGODB) return VideoM.findByIdAndDelete(id);

  return knex("dashboard_videos").where({ id }).del();
}

async function createOrUpdateContactUsInfo(body) {
  // ======================
  // MongoDB
  // ======================
  if (cfg.db.type === dbs.MONGODB) {
    const existing = await ContactUsInfoM.findOne();

    if (existing) {
      return await ContactUsInfoM.findByIdAndUpdate(
        existing._id,
        { ...body },
        { new: true }
      );
    }

    return await ContactUsInfoM.create(body);
  }

  // ======================
  // SQL (Knex)
  // ======================
  const existing = await knex("contact_us_info").first();

  if (existing) {
    await knex("contact_us_info").where({ id: existing.id }).update(body);

    return knex("contact_us_info").where({ id: existing.id }).first();
  }

  const [id] = await knex("contact_us_info").insert(body).returning("id");

  return knex("contact_us_info").where({ id }).first();
}

async function getContactUsInfo() {
  /* ======================
     MongoDB
  ====================== */
  if (cfg.db.type === dbs.MONGODB) {
    return ContactUsInfoM.findOne().lean();
  }

  /* ======================
     SQL (Knex)
  ====================== */
  return knex("contact_us_info").first();
}

async function createFaq(data) {
  if (cfg.db.type === dbs.MONGODB) {
    return faqM.create(data);
  }

  const [id] = await knex(sqlTableNames.FAQ)
    .insert(data)
    .returning("id")
    .catch(async (err) => {
      if (err?.message?.includes("RETURNING")) {
        const res = await knex(sqlTableNames.FAQ).insert(data);
        return [res[0]];
      }
      throw err;
    });

  return knex(sqlTableNames.FAQ).where({ id }).first();
}
async function listFaqs() {
  if (cfg.db.type === dbs.MONGODB) {
    return faqM.find().sort({ createdAt: -1 }).lean();
  }

  return knex(sqlTableNames.FAQ).select("*").orderBy("created_at", "desc");
}
async function deleteFaq(id) {
  if (cfg.db.type === dbs.MONGODB) {
    return faqM.findByIdAndDelete(id);
  }

  return knex(sqlTableNames.FAQ).where({ id }).del();
}
async function bulkInsertFaqs(faqs) {
  if (!Array.isArray(faqs) || faqs.length === 0) {
    return [];
  }

  /* ======================
     MongoDB
  ====================== */
  if (cfg.db.type === dbs.MONGODB) {
    const docs = faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }));

    await faqM.insertMany(docs, { ordered: false });
    return faqM.find().lean();
  }

  /* ======================
     SQL (Knex)
  ====================== */
  await knex.transaction(async (trx) => {
    await trx(sqlTableNames.FAQ).insert(faqs);
  });

  return knex(sqlTableNames.FAQ).select("*");
}

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

  //other
  createOrUpdateContactUsInfo,
  getContactUsInfo,

  //faq

  createFaq,
  listFaqs,
  bulkInsertFaqs,
  deleteFaq,
};
