import express,{ Request, Response, NextFunction } from "express";
import { registerUser } from "../controllers/pagesController";

const router = express.Router();

router.post("/login.html", redirectToIndexIfLoggedIn, registerUser);

function redirectToIndexIfLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  if (token) {
    // User is already logged in, redirect to index page
    res.redirect("/index.html");
  } else {
    // User is not logged in, continue with the registration process
    next();
  }
}

// export default redirectToIndexIfLoggedIn;
export default router;