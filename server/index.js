import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js"; // Database connection
import cookieParser from "cookie-parser";
import messageRoute from "./routes/messageRoute.js"; // Message routes
import userRoute from "./routes/userRoutes.js"; // User routes
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;

// Middleware for CORS configuration (if front-end is on a different port)
app.use(
  cors({
    origin: "http://localhost:5173", // Update to the correct React app URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(cookieParser()); // Cookie parser for handling cookies

// API routes
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/user", userRoute);

// Database connection
connectDB();

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
