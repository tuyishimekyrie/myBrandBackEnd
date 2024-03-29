"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCount = exports.deleteUser = exports.getAllUsers = exports.loginUser = exports.registerUser = exports.registerUserWithGoogle = exports.currentUser = void 0;
const userSchema_1 = __importDefault(require("../schemas/userSchema"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginDtos_1 = require("../Dtos/loginDtos");
const currentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            return res
                .status(401)
                .json({ message: "No token, authorization denied" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtPrivateKey"));
        const user = yield userSchema_1.default.findById(decoded._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        // console.error("Error getting current user:", error);
        // res.status(500).json({ message: "Internal Server Error" });
        // console.log("Error getting current user:", error);
        res.send({ message: "Internal Server Error" });
    }
});
exports.currentUser = currentUser;
const registerUserWithGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.registerUserWithGoogle = registerUserWithGoogle;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { name, email, password, confirmpassword } = userSchema.parse(
        //   req.body
        // ) as UserDtos;
        const { name, email, password, confirmpassword } = req.body;
        let existingUser = yield userSchema_1.default.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send("User with this email already registered");
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, salt);
        const hashedConfirmpassword = yield bcryptjs_1.default.hash(req.body.confirmpassword, salt);
        existingUser = new userSchema_1.default({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            confirmpassword: hashedConfirmpassword,
            isAdmin: "false",
        });
        yield existingUser.save();
        const token = jsonwebtoken_1.default.sign({ _id: existingUser._id }, config_1.default.get("jwtPrivateKey"));
        // console.log(token)
        // res.header("x-auth-token", token).status(201).send({
        //   email: existingUser.email,
        //   password: existingUser.password,
        // });
        res.header("x-auth-token", token).status(201).json({ message: "Successfully Created An Account" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        }
        else {
            res.status(500).send("Internal Server Error");
        }
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = loginDtos_1.loginSchema.parse(req.body);
        const existingUser = yield userSchema_1.default.findOne({ email });
        if (!existingUser) {
            return res.status(400).send("Invalid email or password");
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid email or password");
        }
        const tokenPayload = {
            _id: existingUser._id,
            isAdmin: existingUser.isAdmin,
        };
        const token = jsonwebtoken_1.default.sign(tokenPayload, config_1.default.get("jwtPrivateKey"));
        res.header("x-auth-token", token).status(200).json({ token, isAdmin: existingUser.isAdmin });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        }
        else {
            res.status(500).send("Internal Server Error");
        }
    }
});
exports.loginUser = loginUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userSchema_1.default.find({}, { password: 0 });
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json({ users });
    }
    catch (error) {
        // console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllUsers = getAllUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield userSchema_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        yield userSchema_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        // console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteUser = deleteUser;
const getUserCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCount = yield userSchema_1.default.countDocuments();
        res.status(200).json({ count: userCount });
    }
    catch (error) {
        // console.error("Error fetching user count:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getUserCount = getUserCount;
