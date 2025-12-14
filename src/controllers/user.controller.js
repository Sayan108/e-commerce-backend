import { Messages } from "../config/messages.js";
import userModel from "../models/user.model.js";

export const getOwnDetails = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.id);
    res.json({ user, message: Messages.USER.PROFILE_FETCH_SUCCESS });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getUserDetailsById = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.body.id);
    res.json({ user, message: Messages.USER.PROFILE_FETCH_SUCCESS });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder } = req.body;
    const users = await userModel.listUsers({
      page,
      limit,
      sortBy,
      sortOrder,
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      return res
        .status(400)
        .json({ message: "Cannot update user password from here" });
    }
    const updatedUser = await userModel.updateUser(
      req.body.id,
      req.body.changes
    );
    res
      .status(200)
      .json({ updatedUser, message: Messages.USER.PROFILE_UPDATE_SUCCESS });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateSelf = async (req, res) => {
  try {
    if (req.body.password) {
      return res
        .status(400)
        .json({ message: "Cannot update user password from here" });
    }
    const updateSelf = await userModel.updateUser(req.user.id, req.body);
    res
      .status(200)
      .json({ updateSelf, message: Messages.USER.PROFILE_UPDATE_SUCCESS });
  } catch (error) {
    res.status(500).json({ error });
  }
};
