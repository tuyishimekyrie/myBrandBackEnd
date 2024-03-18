"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messagesController_1 = require("../controllers/messagesController");
const admin_1 = __importDefault(require("../middleware/admin"));
const router = express_1.default.Router();
/**
 * @openapi
 * /api/messages/getALL:
 *   get:
 *     tags:
 *       - Messages
 *     description: Get all messages
 *     security:
 *       - bearerAuth: []
 *       - adminAuth: []
 *     responses:
 *       '200':
 *         description: All messages retrieved successfully
 *       '401':
 *         description: Unauthorized - user authentication failed
 *       '403':
 *         description: Forbidden - user is not an admin
 */
router.get("/getALL", admin_1.default, messagesController_1.getAllMessages);
/**
 * @openapi
 * /api/messages/create:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Create a new message
 *     description: Creates a new message with the provided email and message content.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the sender.
 *               message:
 *                 type: string
 *                 description: Message content.
 *     responses:
 *       '201':
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message.
 *                 newMessage:
 *                   type: object
 *                   description: The newly created message object.
 *       '400':
 *         description: Bad request - missing or invalid message data
 *       '401':
 *         description: Unauthorized - user authentication failed
 *       '500':
 *         description: Internal Server Error
 */
router.post("/create", messagesController_1.createMessage);
/**
 * @openapi
 * /api/messages/getMessageCount:
 *   get:
 *     tags:
 *       - Messages
 *     description: Get the count of messages
 *     security:
 *       - bearerAuth: []
 *       - adminAuth: []
 *     responses:
 *       '200':
 *         description: Message count retrieved successfully
 *       '401':
 *         description: Unauthorized - user authentication failed
 *       '403':
 *         description: Forbidden - user is not an admin
 */
router.get("/getMessageCount", admin_1.default, messagesController_1.getMessageCount);
exports.default = router;
