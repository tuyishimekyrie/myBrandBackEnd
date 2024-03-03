"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// Define your Zod schema
const userSchema = zod_1.default.object({
    name: zod_1.default.string().min(3).max(50),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(5),
    confirmpassword: zod_1.default.string().min(5),
});
exports.userSchema = userSchema;