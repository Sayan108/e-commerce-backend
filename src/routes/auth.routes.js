import express from "express";

import {
  createAdminUser,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post("/create-admin", createAdminUser);

export { router };
