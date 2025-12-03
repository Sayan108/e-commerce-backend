import { config as cfg, dbs, sqlTableNames } from "../config/index.js";

let knex;
let mongoose;
let ProductM;
let VideoM;

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
};
