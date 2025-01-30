import express from "express";
import {
  login,
  logout,
  register,
  updateProfile
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { imgUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(imgUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router
  .route("/profile/update")
  .post(isAuthenticated, imgUpload, updateProfile);

export default router;
