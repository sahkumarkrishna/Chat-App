import jwt from "jsonwebtoken";

// Authentication middleware
const authenticate = (req, res, next) => {
  try {
    // Check for token in cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
   
    req.user = decoded; // Store decoded token data in req.user

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticate;
