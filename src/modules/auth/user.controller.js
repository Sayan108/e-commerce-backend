import { Messages } from "../../config/messages.js";
import UserModel from "./user.model.js";

class UserController {
  async getOwnDetails(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      res.json({ user, message: Messages.USER.PROFILE_FETCH_SUCCESS });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getUserDetailsById(req, res) {
    try {
      const user = await UserModel.findById(req.body.id);
      res.json({ user, message: Messages.USER.PROFILE_FETCH_SUCCESS });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getAllUsers(req, res) {
    try {
      const { page, limit, sortBy, sortOrder } = req.body;
      const users = await UserModel.listUsers({
        page,
        limit,
        sortBy,
        sortOrder,
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async updateUser(req, res) {
    try {
      if (req.body.password) {
        return res
          .status(400)
          .json({ message: "Cannot update user password from here" });
      }
      const updatedUser = await UserModel.updateUser(
        req.body.id,
        req.body.changes
      );
      res
        .status(200)
        .json({ updatedUser, message: Messages.USER.PROFILE_UPDATE_SUCCESS });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async updateSelf(req, res) {
    try {
      if (req.body.password) {
        return res
          .status(400)
          .json({ message: "Cannot update user password from here" });
      }
      const updateSelf = await UserModel.updateUser(req.user.id, req.body);
      res
        .status(200)
        .json({ updateSelf, message: Messages.USER.PROFILE_UPDATE_SUCCESS });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default UserController;
