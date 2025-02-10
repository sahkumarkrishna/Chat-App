import express from "express";
import {
  getOtherUsers,
  login,
  logout,
  register,
} from "../controllers/userController.js";

import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Register a new user
router.route("/register").post(register);

// Login a user
router.route("/login").post(login);

// Logout a user (change method to POST or DELETE as per REST standards)
router.route("/logout").post(logout);

// Get other users (authenticated route)
router.route("/").get(authenticate, getOtherUsers);

export default router;
