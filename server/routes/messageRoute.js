import express from "express";
import { getMessage, sendMessage } from "../controllers/messageController.js";
import authenticate from "../middleware/authenticate.js"; // Import the middleware

const router = express.Router();

// Apply the authenticate middleware to the sendMessage route
router.route("/send/:id").post(authenticate, sendMessage);
router.route("/:id").get(authenticate,getMessage)
export default router;
