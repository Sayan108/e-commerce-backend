import userModel from "../models/user.model.js";

export const getOwnDetails = async (req, res) => {
  const user = await userModel.getUserById(req.user.id);
  res.json(user);
};

export const getAllUsers = async (req, res) => {
  const users = await userModel.listUsers();
  res.json(users);
};
