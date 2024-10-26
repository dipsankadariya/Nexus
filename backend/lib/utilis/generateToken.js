import jwt from 'jsonwebtoken';

// Function to generate a JWT token and set it as a cookie in the response
export const generateTokenAndSetCookie = (userId, res) => {
    // Create a JWT token with the user ID as payload, using the secret key from environment variables
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d' // Token will expire in 15 days
    });

    // Set the token as a cookie in the response
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // Expiry time set to 15 days in milliseconds
        httpOnly: true, // Cookie is only accessible by the web server (prevents XSS attacks)
        sameSite: "strict", // Restricts cookie to same-site requests to prevent CSRF attacks
        secure: process.env.NODE_ENV !== "development", // Cookie is only sent over HTTPS in production
    });
};
