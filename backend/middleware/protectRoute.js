
import User from "../models/user.model.js"; // Import the User model
import jwt from "jsonwebtoken";
// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try {
        // Get the token from cookies
        const token = req.cookies.jwt;

        // Check if the token is provided; if not, return an unauthorized error
        if (!token) {
            return res.status(401).json({ error: "No token provided, unauthorized" });
        }

        // Verify the token using the secret from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token is valid; if not, return an unauthorized error
        if (!decoded) {
            return res.status(401).json({ error: "Invalid token, unauthorized" });
        }

        // Find the user by ID from the decoded token, excluding the password field
        const user = await User.findById(decoded.userId).select("-password");

        // Check if the user exists; if not, return a not found error
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Attach the user object to the request for use in the next middleware
        req.user = user;

        // Call the next middleware in the stack
        next();
    } catch (error) {
        // Log the error for debugging purposes
        console.log("Error in protectRouteMiddleware", error.message);

        // Return a 500 status indicating an internal server error
        res.status(500).json({ error: "Internal Server Error" });
    }
}
