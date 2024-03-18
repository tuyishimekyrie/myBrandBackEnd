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
        const reversedMessages = messages.reverse();
        res.status(200).json(reversedMessages);
    }
    catch (error) {
        // console.error("Error listing messages:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllMessages = getAllMessages;
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, message } = req.body;
        const newMessage = new messageSchema_1.default({ email, message });
        yield newMessage.save();
        res
            .status(201)
            .json({ message: "Message created successfully", newMessage });
    }
    catch (error) {
        // console.error("Error creating message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createMessage = createMessage;
const getMessageCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageCount = yield messageSchema_1.default.countDocuments();
        res.status(200).json({ count: messageCount });
    }
    catch (error) {
        // console.error("Error fetching message count:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getMessageCount = getMessageCount;
