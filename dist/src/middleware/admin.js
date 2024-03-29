"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
function admin(req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).send("Access denied, no token provided");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token.replace("Bearer ", ""), config_1.default.get("jwtPrivateKey"));
        req.user = decoded;
        if (req.user && req.user.isAdmin) {
            next();
        }
        else {
            return res.status(403).send("Access denied. User is not an admin.");
        }
    }
    catch (ex) {
        if (ex.name === "TokenExpiredError") {
            return res.status(401).send("Access token expired");
        }
        else if (ex.name === "JsonWebTokenError") {
            return res.status(400).send("Invalid token");
        }
        else {
            return res.status(500).send("Internal Server Error");
        }
    }
}
exports.default = admin;
