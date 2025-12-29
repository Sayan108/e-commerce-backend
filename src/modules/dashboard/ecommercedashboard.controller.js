import ecommercedashboardModel from "./ecommercedashboard.model.js";

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

/* ===================== LIST FAQs ===================== */
export async function listFaqs(req, res, next) {
  try {
    const faqs = await ecommercedashboardModel.listFaqs();

    res.status(200).json({
      success: true,
      result: faqs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, message: "Failed to fetch faqs." });
  }
}

/* ===================== CREATE FAQ ===================== */
export async function createFaq(req, res, next) {
  try {
    const faq = await ecommercedashboardModel.createFaq(req.body);

    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      result: faq,
    });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to create faq." });
  }
}

/* ===================== DELETE FAQ ===================== */
export async function deleteFaq(req, res, next) {
  try {
    const { id } = req.params;

    const deleted = await ecommercedashboardModel.deleteFaq(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, message: "Failed to delete faq." });
  }
}

/* ===================== BULK UPDATE FAQs ===================== */
export async function bulkUpdateFaqs(req, res, next) {
  try {
    const { faqs } = req.body;

    if (!Array.isArray(faqs)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be an array of FAQs",
      });
    }

    const updatedFaqs = await ecommercedashboardModel.bulkInsertFaqs(faqs);

    res.status(200).json({
      success: true,
      message: "FAQs updated successfully",
      result: updatedFaqs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, message: "Failed to update buk faq." });
  }
}

export async function createOrUpdateContactUsInfo(req, res, next) {
  try {
    const constactUsInfo =
      await ecommercedashboardModel.createOrUpdateContactUsInfo(req.body);

    res.status(201).json({
      success: true,
      message: "Contact us info updated successfully",
      result: constactUsInfo,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error, message: "Failed to update contact us infoq." });
  }
}

export async function getContactUsInfo(req, res, next) {
  try {
    const constactUsInfo = await ecommercedashboardModel.getContactUsInfo();

    res.status(200).json({
      success: true,
      message: "Contact us info updated successfully",
      result: constactUsInfo,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error, message: "Failed to update contact us infoq." });
  }
}
