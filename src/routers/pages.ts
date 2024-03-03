import express,{ Request, Response, NextFunction } from "express";
import { registerUser } from "../controllers/pagesController";

const router = express.Router();

router.post("/login.html", redirectToIndexIfLoggedIn, registerUser);

function redirectToIndexIfLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = localStorage.getItem("token"); 
  if (token) {
    
    res.redirect("/index.html");
  } else {
 
    next();
  }
}


export default router;