import userModel from "../models/user.model.js";

import bcrypt from "bcrypt";
import { signToken } from "../middleware/auth.middleware.js";
import { Messages } from "../config/messages.js";
import { Roles } from "../config/index.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (role && role !== Roles.CUSTOMER) {
    return res.status(403).json({ error: Messages.AUTH.INVALID_ROLE });
  }
  if (!email || !password)
    return res
      .status(400)
      .json({ error: Messages.VALIDATION.REQUIRED_FIELDS_MISSING });
  try {
    const existing = await userModel.findByEmail(email);
    if (existing)
      return res
        .status(400)
        .json({ error: Messages.AUTH.EMAIL_ALREADY_EXISTS });
    const user = await userModel.createUser({
      name,
      email,
      password,
      role: Roles.CUSTOMER,
    });
    const token = signToken(user);
    res.json({ user, token, message: Messages.AUTH.REGISTER_SUCCESS });
  } catch (error) {
    res.status(500).json({ error, message: Messages.AUTH.REGISTER_FAILURE });
  }
};

export const logout = async (req, res) => {
  // For stateless JWT, logout can be handled on client side by deleting the token.
  const user = userModel.findById(req.user._id);
  if (!user) {
    return res.status(400).json({ error: Messages.AUTH.USER_NOT_FOUND });
  }
  const removedToken = user.token.filter((t) => t !== req.token);
  await userModel.updateUser(req.user._id, { token: removedToken });
  res.json({ message: Messages.AUTH.LOGOUT_SUCCESS });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findByEmail(email);
  if (!user)
    return res
      .status(400)
      .json({ error: Messages.AUTH.ERROR_INVALID_CREDENTIALS });
  try {
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res
        .status(400)
        .json({ error: Messages.AUTH.ERROR_INVALID_CREDENTIALS });
    const token = signToken(user);

    await userModel.updateUser(user._id, { token: user.token });
    res.json({ user, token, message: Messages.AUTH.LOGIN_SUCCESS });
  } catch (error) {
    res
      .status(500)
      .json({ error, message: Messages.AUTH.ERROR_INVALID_CREDENTIALS });
  }
};

export const createAdminUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!role || (role !== Roles.ADMIN && role !== Roles.SUPERADMIN)) {
    return res.status(403).json({ error: Messages.AUTH.INVALID_ROLE });
  }
  if (!email || !password)
    return res
      .status(400)
      .json({ error: Messages.VALIDATION.REQUIRED_FIELDS_MISSING });
  try {
    const existing = await userModel.findByEmail(email);
    if (existing)
      return res
        .status(400)
        .json({ error: Messages.AUTH.EMAIL_ALREADY_EXISTS });
    const user = await userModel.createUser({
      name,
      email,
      password,
      role,
    });
    const token = signToken(user);
    res.json({ user, token, message: Messages.AUTH.REGISTER_SUCCESS });
  } catch (error) {
    res.status(500).json({ error, message: Messages.AUTH.REGISTER_FAILURE });
  }
};
