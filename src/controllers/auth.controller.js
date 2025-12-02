import userModel from "../models/user.model.js";

import bcrypt from "bcrypt";
import { signToken } from "../middleware/auth.middleware.js";
import { Messages } from "../config/messages.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
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
    const user = await userModel.createUser({ name, email, password, role });
    const token = signToken(user);
    res.json({ user, token, message: Messages.AUTH.REGISTER_SUCCESS });
  } catch (error) {
    res.status(500).json({ error, message: Messages.AUTH.REGISTER_FAILURE });
  }
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
    res.json({ user, token, message: Messages.AUTH.LOGIN_SUCCESS });
  } catch (error) {
    res
      .status(500)
      .json({ error, message: Messages.AUTH.ERROR_INVALID_CREDENTIALS });
  }
};
