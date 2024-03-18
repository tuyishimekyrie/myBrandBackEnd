import express, { NextFunction, Request, Response } from "express";
import config from "config";
import mongoose from "mongoose";
import users from "./routers/users";
import blogs from "./routers/blogs";
import messages from "./routers/messages";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import swaggerDocs from "./utils/swagger";
import createServer from "./utils/serverTest";
import jwt from "jsonwebtoken";
// import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import User from "./schemas/userSchema";
import GoogleUser from "./schemas/googleSchema";
const router = express.Router();
// const app = express();
export const app = createServer();

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000, // 1 minute in milliseconds
      secure: false, // Adjust this as needed based on your application's requirements
    },
  })
);

// app.use(
//   session({
//     secret: "your-secret-key",
//     resave: false, // Set resave to false to prevent session from being saved to the session store on every request
//     saveUninitialized: false, // Set saveUninitialized to false to prevent empty sessions from being saved
//     cookie: {
//       secure: false, // Set secure to false if you are not using HTTPS
//       httpOnly: true, // Set httpOnly to true to prevent client-side access to cookies
//       maxAge: 24 * 60 * 60 * 1000, // Set maxAge to define the expiration time of the cookie (e.g., 24 hours)
//     },
//   })
// );

app.use(passport.initialize());
// app.use(passport.session());
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// Passport.js Google OAuth strategy setup
// Check if the environment variable is defined
const clientID: any = config.get("GOOGLE_CLIENT_ID");
if (!clientID) {
  throw new Error("Google client ID is not defined");
}

const clientSecret: any = config.get("GOOGLE_CLIENT_SECRET");
if (!clientSecret) {
  throw new Error("Google client secret is not defined");
}

passport.use(
  new GoogleStrategy(
    {
      clientID, // Reuse the variable
      clientSecret, // Reuse the variable
      callbackURL: "/googleregister/callback",
      passReqToCallback: true, // Pass the request object to the callback
    },
    async (req, accessToken, refreshToken, profile, done) => {
      // Check if the user already exists in your database
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // If the user doesn't exist, create a new user in the database
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email:
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : null,

          photo:
            profile.photos && profile.photos.length > 0
              ? profile.photos[0].value
              : null,
          isAdmin: "false",
          // Add any other necessary fields
        });
      }

      const tokenPayload = {
        _id: user._id,
        isAdmin: user.isAdmin,
        // Add any other necessary fields to the token payload
      };
      const token = jwt.sign(tokenPayload, config.get("jwtPrivateKey"));
      console.log(user);
      console.log(token);

      // Send the token back to the client as a response
      return done(null, { user, token });
    }
  )
);
// // Serialize user to store in session
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// // // Deserialize user from session
// passport.deserializeUser((obj: any, done) => {
//   done(null, obj);
// });
passport.serializeUser((user: any, done) => {
  const payload = {
    id: user._id, // Assuming user has an 'id' property
    // You can include additional data if needed
  };
  const token = jwt.sign(payload, config.get("jwtPrivateKey"));
  done(null, token);
});
interface CustomJwtPayload extends jwt.JwtPayload {
  googleID?: string; // Define the googleID property as optional
}

passport.deserializeUser(async (token: any, done) => {
  try {
    const payload = jwt.verify(
      token,
      config.get("jwtPrivateKey")
    ) as CustomJwtPayload;
    if (!payload) {
      return done(new Error("Invalid token"));
    }
    // Check if googleID exists before accessing it
    if (payload.googleID) {
      // Handle Google auth logic
    } else {
      // Fetch user data based on the ID stored in the JWT payload
      const user = await User.findById(payload.id);
      done(null, user); // Pass the user object to the next middleware
    }
  } catch (err) {
    done(err); // Pass any errors to the next middleware
  }
});

// Route handler for '/googleregister' endpoint
app.get(
  "/googleregister",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
// app.get("/auth/google", (req, res) => {
//   // Redirect to Google's authentication endpoint
//   res.redirect(
//     `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=/googleregister/callback&response_type=code&scope=openid%20profile%20email`
//   );
// });

// Callback route after Google authentication
// app.get(
//   "/googleregister/callback",
//   passport.authenticate("google", {
//     successRedirect: "http://localhost:5173/login", // Redirect to success page
//     failureRedirect: "/error", // Redirect to error page
//   })
// );

// Callback route after Google authentication
// app.get(
//   "/googleregister/callback",
//   (req, res, next) => {
//     // Set cache-control header to prevent caching
//     res.setHeader("Cache-Control", "no-cache, no-store");

//     // Continue to the passport authentication middleware
//     next();
//   },
//   passport.authenticate("google", {
//     successRedirect: "http://127.0.0.1:5502/UI/pages/login.html", // Redirect to success page
//     failureRedirect: "/error", // Redirect to error page
//   })
// );

// Callback route after Google authentication
// app.get(
//   "/googleregister/callback",
//   (req, res, next) => {
//     // Set cache-control header to prevent caching
//     res.setHeader("Cache-Control", "no-cache, no-store");

//     // Continue to the passport authentication middleware
//     next();
//   },
//   passport.authenticate("google", {
//     successRedirect: "http://127.0.0.1:5502/UI/pages/login.html", // Redirect to success page
//     failureRedirect: "/error", // Redirect to error page
//   }),

//   (req: Request, res: Response) => {
//     // This function will be called after the authentication is successful
//     // Extract the token from the request object
//     const { user, token } = req.user as { user: any; token: string }; // Assuming the token is stored in the user object by Passport.js

//     // Now you can use the user and token as needed
//     console.log("user: ",user); // Access user properties
//     console.log(token); // Access token

//     // Send the token and any other relevant data as a response
//     res.status(200).json({ user, token }); // Example response
//     // res.redirect("http://127.0.0.1:5502/UI/pages/login.html");
//   }
// );
// Callback route after Google authentication
app.get(
  "/googleregister/callback",
  (req, res, next) => {
    // Set cache-control header to prevent caching
    res.setHeader("Cache-Control", "no-cache, no-store");

    // Continue to the passport authentication middleware
    next();
  },
  passport.authenticate("google"), // Disable session as we handle token ourselves
  (req, res) => {
    // This function will be called after the authentication is successful

    // Check if user and token are available in request object
    if (!req.user) {
      return res.status(500).json({ error: "Authentication failed" });
    }

    // Extract the token and user data from the request object
    const { user, token } = req.user as { user: any; token: string };
    // Check if the user has admin privileges
    const isAdmin = user.isAdmin === true; // Assuming isAdmin is stored as a string
    console.log(isAdmin);
    // Now you can use the user and token as needed
    console.log("User:", user); // Access user properties
    console.log("Token:", token); // Access token

    // Redirect based on user's admin status
 if (isAdmin) {
   res.redirect(
     `https://mybrandvercel.vercel.app/UI/pages/adminLogin.html?token=${token}`
   ); // Redirect to the admin dashboard
 } else {
   res.redirect(
     `https://mybrandvercel.vercel.app/UI/pages/login.html?token=${token}`
   ); // Redirect to the regular user dashboard
 }


    // Send the token and any other relevant data as a response
    // res.status(200).json(token); // Example response
  }
);
// Add this route handler to your backend server
app.post("/exchangeCodeForToken", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Authorization code is missing" });
  }

  try {
    // Exchange the authorization code for an access token using your Google OAuth client
    // For example:
    // const tokenResponse = await googleOAuthClient.getToken(code);
    // const accessToken = tokenResponse.tokens.access_token;

    // For testing purposes, let's assume we received the access token from Google
    const accessToken = code;

    // Return the access token to the frontend
    res.json({ token: accessToken });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).json({ error: "Failed to exchange code for token" });
  }
});


app.post("/logout", function (req: Request, res: Response, next: NextFunction) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.cookie("connect.sid", "", { expires: new Date(0) });
      res.clearCookie("connect.sid"); // Clear session cookie
      // Set cache-control header to prevent caching
      res.setHeader("Cache-Control", "no-cache, no-store");
      res.redirect("http://127.0.0.1:5502/"); // Redirect the user after logout
    });
  });
});

// Example route to check if the user is authenticated
app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.send(`Hello, ${req.user}!`);
  } else {
    res.send("Hello, Guest!");
  }
});

swaggerDocs(app, 3000);

if (!config.get("jwtPrivateKey")) {
  console.error("Configuration is not set");
  process.exit(1);
}
// const dbpassword = process.env.dbpassword;
const dbpassword = config.get("dbpassword");

if (!config.get("dbpassword")) {
  console.error("FATAL ERROR: dbpassword environment variable is not defined");
  process.exit(1);
}

const db = config.get("db");

mongoose
  .connect(config.get("db"))
  .then(() => console.log("Database Running", db))
  .catch((error) => console.error("Database Connection Failed:", error));

const PORT = process.env.PORT || 3000;

app.use("/api/users", users);

app.use("/api/blogs", blogs);

app.use("/api/messages", messages);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the backend!");
});
app.get("/error", (req: Request, res: Response) => {
  res.send("Hello from the backend!, ERROR OCCURED");
});

export const servers = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
