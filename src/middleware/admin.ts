import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";


interface CustomRequest extends Request {
  user?: any; 
}

function admin(req: CustomRequest, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).send("Access denied, no token provided");
  }

  try {
  
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      config.get("jwtPrivateKey")
    );

   
    req.user = decoded;

   
    if (req.user && req.user.isAdmin) {
    
      next();
    } else {
      return res.status(403).send("Access denied. User is not an admin.");
    }
  } catch (ex: any) {
  
    if (ex.name === "TokenExpiredError") {
      return res.status(401).send("Access token expired");
    } else if (ex.name === "JsonWebTokenError") {
      return res.status(400).send("Invalid token");
    } else {
      
      return res.status(500).send("Internal Server Error");
    }
  }
}

export default admin;
