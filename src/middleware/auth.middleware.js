import jwt from "jsonwebtoken";
import { config as cfg } from "../config/index.js";

import { Messages } from "../config/messages.js";
import UserModel from "../modules/auth/user.model.js";

class AuthMiddleware {
  static signToken(user) {
    return jwt.sign(
      { id: user.id || user._id, role: user.role },
      cfg.jwtSecret,
      {
        expiresIn: "7d",
      }
    );
  }

  static async authMiddleware(req, res, next) {
    const h = req.headers.authorization;
    if (!h || !h.startsWith("Bearer "))
      return res.status(401).json({ error: Messages.AUTH.ERROR_UNAUTHORIZED });
    const token = h.slice(7);
    try {
      const payload = jwt.verify(token, cfg.jwtSecret);
      const user = await UserModel.findById(payload.id);
      if (!user)
        return res
          .status(401)
          .json({ error: Messages.AUTH.ERROR_ACCOUNT_NOT_FOUND });
      req.user = { id: user.id || user._id, role: user.role };
      next();
    } catch (e) {
      return res.status(401).json({ error: Messages.AUTH.ERROR_TOKEN_EXPIRED });
    }
  }
}

export { AuthMiddleware };
