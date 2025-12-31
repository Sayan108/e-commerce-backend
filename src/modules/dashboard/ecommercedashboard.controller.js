import EcommerceDashboardModel from "./ecommercedashboard.model.js";

class EcommerceDashboardController {
  async createDashBoardBanner(req, res) {
    const data = req.body;
    try {
      const banner = await EcommerceDashboardModel.createDashBoardBanner(data);
      res.status(201).json({ banner, message: "Banner created successfully." });
    } catch (error) {
      res.status(500).json({ error, message: "Failed to create banner." });
    }
  }

  async getAllDashBoardBanners(req, res) {
    try {
      const banners = await EcommerceDashboardModel.listDashBoardBanners();
      res.json({ banners });
    } catch (error) {
      res.status(500).json({ error, message: "Failed to fetch banners." });
    }
  }

  async deleteDashBoardBanner(req, res) {
    const { id } = req.params;
    try {
      await EcommerceDashboardModel.deleteDashBoardBanner(id);
      res.json({ message: "Banner deleted successfully." });
    } catch (error) {
      res.status(500).json({ error, message: "Failed to delete banner." });
    }
  }

  async updateDashBoardBanner(req, res) {
    const { id } = req.params;
    const changes = req.body;
    try {
      const updatedBanner = await EcommerceDashboardModel.updateDashBoardBanner(
        id,
        changes
      );
      res.json({ updatedBanner, message: "Banner updated successfully." });
    } catch (error) {
      res.status(500).json({ error, message: "Failed to update banner." });
    }
  }

  async getDashboardVideos(req, res) {
    try {
      const videos = await EcommerceDashboardModel.listDashboardVideos();
      res.json({ videos });
    } catch (error) {
      res.status(500).json({ error, message: "Failed to fetch videos." });
    }
  }

  async createDashboardVideo(req, res) {
    const data = req.body;
    try {
      const video = await EcommerceDashboardModel.createDashboardVideo(data);
      res.status(201).json({ video, message: "Video created successfully." });
    } catch (error) {
      res.status(500).json({ error, message: "Failed to create video." });
    }
  }

  async updateDashboardVideo(req, res) {
    const { id } = req.params;
    const changes = req.body;

    try {
      const updatedVideo = await EcommerceDashboardModel.updateDashboardVideo(
        id,
        changes
      );
      res.json({ updatedVideo, message: "Video updated successfully." });
    } catch (error) {
      res.status(500).json({ error, message: "Failed to update video." });
    }
  }

  async deleteDashboardVideo(req, res) {
    const { id } = req.params;
    try {
      await EcommerceDashboardModel.deleteDashboardVideo(id);
      res.json({ message: "Video deleted successfully." });
    } catch (error) {
      res.status(500).json({ error, message: "Failed to delete video." });
    }
  }

  /* ===================== LIST FAQs ===================== */
  async listFaqs(req, res, next) {
    try {
      const faqs = await EcommerceDashboardModel.listFaqs();

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
  async createFaq(req, res, next) {
    try {
      const faq = await EcommerceDashboardModel.createFaq(req.body);

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
  async deleteFaq(req, res, next) {
    try {
      const { id } = req.params;

      const deleted = await EcommerceDashboardModel.deleteFaq(id);

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
  async bulkUpdateFaqs(req, res, next) {
    try {
      const { faqs } = req.body;

      if (!Array.isArray(faqs)) {
        return res.status(400).json({
          success: false,
          message: "Request body must be an array of FAQs",
        });
      }

      const updatedFaqs = await EcommerceDashboardModel.bulkInsertFaqs(faqs);

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

  async createOrUpdateContactUsInfo(req, res, next) {
    try {
      const constactUsInfo =
        await EcommerceDashboardModel.createOrUpdateContactUsInfo(req.body);

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

  async getContactUsInfo(req, res, next) {
    try {
      const constactUsInfo = await EcommerceDashboardModel.getContactUsInfo();

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
}

export default EcommerceDashboardController;
