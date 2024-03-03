import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";


interface CustomRequest extends Request {
  user?: any;
}

function auth(req: CustomRequest, res: Response, next: NextFunction) {
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

    
    next();
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

export default auth;
