import express from "express";

import userModel from "../models/user.model.js";

import bcrypt from "bcrypt";
import { signToken } from "../middleware/auth.middleware.js";
import { login, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

export { router };
