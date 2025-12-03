import ecommercedashboardModel from "../models/ecommercedashboard.model.js";

export const createDashBoardBanner = async (req, res) => {
  const data = req.body;
  try {
    const banner = await ecommercedashboardModel.createDashBoardBanner(data);
    res.status(201).json({ banner, message: "Banner created successfully." });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to create banner." });
  }
};

export const getAllDashBoardBanners = async (req, res) => {
  try {
    const banners = await ecommercedashboardModel.listDashBoardBanners();
    res.json({ banners });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to fetch banners." });
  }
};

export const deleteDashBoardBanner = async (req, res) => {
  const { id } = req.params;
  try {
    await ecommercedashboardModel.deleteDashBoardBanner(id);
    res.json({ message: "Banner deleted successfully." });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to delete banner." });
  }
};

export const updateDashBoardBanner = async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  try {
    const updatedBanner = await ecommercedashboardModel.updateDashBoardBanner(
      id,
      changes
    );
    res.json({ updatedBanner, message: "Banner updated successfully." });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to update banner." });
  }
};

export const getDashboardVideos = async (req, res) => {
  try {
    const videos = await ecommercedashboardModel.listDashboardVideos();
    res.json({ videos });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to fetch videos." });
  }
};

export const createDashboardVideo = async (req, res) => {
  const data = req.body;
  try {
    const video = await ecommercedashboardModel.createDashboardVideo(data);
    res.status(201).json({ video, message: "Video created successfully." });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to create video." });
  }
};

export const updateDashboardVideo = async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  try {
    const updatedVideo = await ecommercedashboardModel.updateDashboardVideo(
      id,
      changes
    );
    res.json({ updatedVideo, message: "Video updated successfully." });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to update video." });
  }
};

export const deleteDashboardVideo = async (req, res) => {
  const { id } = req.params;
  try {
    await ecommercedashboardModel.deleteDashboardVideo(id);
    res.json({ message: "Video deleted successfully." });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to delete video." });
  }
};
