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
exports.getMessageCount = exports.createMessage = exports.getAllMessages = void 0;
const messageSchema_1 = __importDefault(require("../schemas/messageSchema"));
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield messageSchema_1.default.find();
        res.status(200).json(messages);
    }
    catch (error) {
        console.error("Error listing messages:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.getAllMessages = getAllMessages;
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract email and message from request body
        const { email, message } = req.body;
        // Create a new message instance
        const newMessage = new messageSchema_1.default({ email, message });
        // Save the message to the database
        yield newMessage.save();
        // Send a success response
        res
            .status(201)
            .json({ message: "Message created successfully", newMessage });
    }
    catch (error) {
        // Handle errors
        console.error("Error creating message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createMessage = createMessage;
// Define the route handler function
const getMessageCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the count of users from the database
        const messageCount = yield messageSchema_1.default.countDocuments();
        // Send the count as a JSON response
        res.status(200).json({ count: messageCount });
    }
    catch (error) {
        // Handle errors
        console.error("Error fetching message count:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getMessageCount = getMessageCount;
