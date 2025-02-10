
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js"; // Assuming you have a database connection
import cookieParser from "cookie-parser";
import messageRoute from "./routes/messageRoute.js"; // Import message routes
import userRoute from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000; // Use port 2000 or environment-defined port

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(cookieParser()); // Use cookie parser to handle cookies

// Use message routes for message-related API endpoints
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/user", userRoute);

// Connect to the database and start the server
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
