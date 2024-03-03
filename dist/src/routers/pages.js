"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pagesController_1 = require("../controllers/pagesController");
const router = express_1.default.Router();
router.post("/login.html", redirectToIndexIfLoggedIn, pagesController_1.registerUser);
function redirectToIndexIfLoggedIn(req, res, next) {
    const token = localStorage.getItem("token");
    if (token) {
        res.redirect("/index.html");
    }
    else {
        next();
    }
}
exports.default = router;
