"use strict";
// serverTest.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
function createServer() {
    const app = (0, express_1.default)();
    //   app.get("/", (req, res) => {
    //     res.status(200).send("Server is running");
    //   });
    return app;
}
exports.default = createServer;
