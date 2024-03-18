"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const router = express_1.default.Router();
const app = (0, express_1.default)();
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Passport.js Google OAuth strategy setup
// Check if the environment variable is defined
const clientID = process.env.GOOGLE_CLIENT_ID;
if (!clientID) {
    throw new Error("Google client ID is not defined");
}
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientSecret) {
    throw new Error("Google client secret is not defined");
}
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID, // Reuse the variable
    clientSecret, // Reuse the variable
    callbackURL: "/googleregister/callback",
    passReqToCallback: true, // Pass the request object to the callback
}, (req, accessToken, refreshToken, profile, done) => {
    // TypeScript will infer the types
    // Your authentication logic here
    const user = {
        googleId: profile.id,
        displayName: profile.displayName,
        // Add any other necessary fields
    };
    // You may want to save the user to your database here
    // For example: User.create(user, (err, newUser) => { ... });
    return done(null, user);
}));
// // Serialize user to store in session
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
// // Deserialize user from session
passport_1.default.deserializeUser((obj, done) => {
    done(null, obj);
});
// Route handler for '/googleregister' endpoint
app.get("/googleregister", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
// Callback route after Google authentication
app.get("/googleregister/callback", passport_1.default.authenticate("google", {
    successRedirect: "/success", // Redirect to success page
    failureRedirect: "/error", // Redirect to error page
}));
module.exports = router;
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import session from "express-session";
// import cors from "cors";
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
//   })
// );
// Configure session
// app.use(
//   session({
//     secret: "your-secret-key",
//     resave: true,
//     saveUninitialized: true,
//   })
// );
// Initialize Passport and restore authentication state from session
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID:
//         "187006986382-oftqtfmdk4mmsuict5ga00enoag2thla.apps.googleusercontent.com",
//       clientSecret: "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",
//       callbackURL: "http://localhost:3000/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       // Save user data in your database or do something with it
//       return done(null, profile);
//     }
//   )
// );
// // Serialize user to store in session
// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// // Deserialize user from session
// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });
// app.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );
// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect("/");
//   }
// );
// Example route to check if the user is authenticated
// app.get("/", (req, res) => {
//   if (req.isAuthenticated()) {
//     console.log(req.user);
//     res.send(`Hello, ${req.user.displayName}!`);
//   } else {
//     res.send("Hello, Guest!");
//   }
// });
// app.post("/logout", function (req, res, next) {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     req.session.destroy((err) => {
//       if (err) {
//         console.error("Error destroying session:", err);
//       }
//       res.redirect("/"); // Redirect the user after logout
//     });
//   });
// });
