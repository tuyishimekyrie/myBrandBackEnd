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
exports.getUserCount = exports.deleteUser = exports.getAllUsers = exports.loginUser = exports.registerUser = exports.currentUser = void 0;
const userSchema_1 = __importDefault(require("../schemas/userSchema"));
const userDtos_1 = require("../Dtos/userDtos");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginDtos_1 = require("../Dtos/loginDtos");
const currentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the token from the request headers
        const token = req.header("x-auth-token");
        // If token is not present, return an error
        if (!token) {
            return res
                .status(401)
                .json({ message: "No token, authorization denied" });
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtPrivateKey"));
        // Find the user based on the decoded user ID
        const user = yield userSchema_1.default.findById(decoded._id).select("-password");
        // If user not found, return an error
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Send the user data as response
        res.json(user);
    }
    catch (error) {
        // Handle errors
        // console.error("Error getting current user:", error);
        // res.status(500).json({ message: "Internal Server Error" });
        console.log("Error getting current user:", error);
        res.send({ message: "Internal Server Error" });
    }
});
exports.currentUser = currentUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, confirmpassword } = userDtos_1.userSchema.parse(req.body);
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
        res.header("x-auth-token", token).status(201).send("Successfully Created An Account");
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
        // Send the token and isAdmin status as a response body
        res.json({ token, isAdmin: existingUser.isAdmin });
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
        // Fetch all users from the database, excluding the password field
        const users = yield userSchema_1.default.find({}, { password: 0 });
        // Check if users are found
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        // Send the users as an object in the response
        res.status(200).json({ users });
    }
    catch (error) {
        // Handle errors
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllUsers = getAllUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract user ID from request parameters
        const { id } = req.params;
        // Check if the user exists
        const user = yield userSchema_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Delete the user from the database
        yield userSchema_1.default.findByIdAndDelete(id);
        // Send a success message in the response
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        // Handle errors
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteUser = deleteUser;
const getUserCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the count of users from the database
        const userCount = yield userSchema_1.default.countDocuments();
        // Send the count as a JSON response
        res.status(200).json({ count: userCount });
    }
    catch (error) {
        // Handle errors
        console.error("Error fetching user count:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getUserCount = getUserCount;
