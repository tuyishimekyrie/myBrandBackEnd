import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";

// Define a custom interface extending Request
interface CustomRequest extends Request {
  user?: any; // Define the user property
}

function admin(req: CustomRequest, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).send("Access denied, no token provided");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      config.get("jwtPrivateKey")
    );

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Check if req.user exists and has isAdmin property
    if (req.user && req.user.isAdmin) {
      // Call next middleware
      next();
    } else {
      return res.status(403).send("Access denied. User is not an admin.");
    }
  } catch (ex: any) {
    // Handle token verification errors
    if (ex.name === "TokenExpiredError") {
      return res.status(401).send("Access token expired");
    } else if (ex.name === "JsonWebTokenError") {
      return res.status(400).send("Invalid token");
    } else {
      // For any other errors, return a generic error message
      return res.status(500).send("Internal Server Error");
    }
  }
}

export default admin;
