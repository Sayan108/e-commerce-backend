import express from "express";

import AuthController from "./auth.controller.js";

const router = express.Router();

const controller = new AuthController();

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/logout", controller.logout);

router.post("/create-admin", controller.createAdminUser);

export { router };
