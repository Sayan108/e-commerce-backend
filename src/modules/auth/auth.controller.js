import UserModel from "./user.model.js";

import bcrypt from "bcrypt";

import { AuthMiddleware } from "../../middleware/auth.middleware.js";
import { Messages } from "../../config/messages.js";
import { Roles } from "../../config/index.js";

class AuthController {
  async register(req, res) {
    const { email, password, role } = req.body;
    if (role && role !== Roles.CUSTOMER) {
      return res.status(403).json({ error: Messages.AUTH.INVALID_ROLE });
    }
    if (!email || !password)
      return res
        .status(400)
        .json({ error: Messages.VALIDATION.REQUIRED_FIELDS_MISSING });
    try {
      const existing = await UserModel.findByEmail(email);
      if (existing)
        return res
          .status(400)
          .json({ error: Messages.AUTH.EMAIL_ALREADY_EXISTS });
      const user = await UserModel.createUser({
        email,
        password,
        role: Roles.CUSTOMER,
      });
      const token = AuthMiddleware.signToken(user);
      const resp = await UserModel.updateUser(user._id, { token: [token] });

      res.json({
        user: { email, role: user.role, _id: user._id },
        token,
        message: Messages.AUTH.REGISTER_SUCCESS,
      });
    } catch (error) {
      res.status(500).json({ error, message: Messages.AUTH.REGISTER_FAILURE });
    }
  }

  async logout(req, res) {
    // For stateless JWT, logout can be handled on client side by deleting the token.
    const user = UserModel.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ error: Messages.AUTH.USER_NOT_FOUND });
    }
    const removedToken = user.token.filter((t) => t !== req.token);
    await UserModel.updateUser(req.user.id, { token: removedToken });
    res.json({ message: Messages.AUTH.LOGOUT_SUCCESS });
  }

  async login(req, res) {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);
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
      const token = AuthMiddleware.signToken(user);

      await UserModel.updateUser(user._id, { token: user.token });
      res.json({
        user: {
          name: user.name,
          email,
          phone: user.phone,
          role: user.role,
          _id: user._id,
        },
        token,
        message: Messages.AUTH.LOGIN_SUCCESS,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: Messages.AUTH.ERROR_INVALID_CREDENTIALS });
    }
  }

  async createAdminUser(req, res) {
    const { email, password, role } = req.body;
    console.log(email, password, role);
    if (!role || (role !== Roles.ADMIN && role !== Roles.SUPERADMIN)) {
      return res.status(403).json({ error: Messages.AUTH.INVALID_ROLE });
    }
    if (!email || !password)
      return res
        .status(400)
        .json({ error: Messages.VALIDATION.REQUIRED_FIELDS_MISSING });
    try {
      const existing = await UserModel.findByEmail(email);
      if (existing)
        return res
          .status(400)
          .json({ error: Messages.AUTH.EMAIL_ALREADY_EXISTS });
      await UserModel.createUser({
        email,
        password,
        role,
      });

      res.json({ message: Messages.AUTH.REGISTER_SUCCESS });
    } catch (error) {
      res.status(500).json({ error, message: Messages.AUTH.REGISTER_FAILURE });
    }
  }
}

export default AuthController;
