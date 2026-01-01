import express from "express";
import {
  registerUser,
  loginUser,
  getProfile
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * Public routes
 */
router.post("/register", registerUser);        // Register
router.post("/login", loginUser);       // Login

/**
 * Protected routes
 */
router.get("/me", auth, getProfile);    // Get logged-in user profile

export default router;