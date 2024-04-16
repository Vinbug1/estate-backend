// authMiddleware.js
const jwt = require('jsonwebtoken');
require("dotenv").config();


// Example secret key (replace with your actual secret)
const secretKey = process.env.SECRET;

// Middleware to extract user ID from JWT
const extractUserIdFromToken = (req, res, next) => {
  // Check if the request has the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.slice(7); // Remove 'Bearer ' from the token
    try {
      // Verify the token using the secret key
      const decoded = jwt.verify(token, secretKey);
      // Extract user ID and attach it to the request
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { extractUserIdFromToken };
