import express from "express";
import {
  getAllMessages,
  createMessage,
  getMessageCount,
} from "../controllers/messagesController";
import admin from "../middleware/admin";

const router = express.Router();


// router.get("/getALL", admin, getAllMessages);
// router.post("/create", createMessage);

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
router.get("/getALL", admin, getAllMessages);

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
router.post("/create", createMessage);

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
router.get("/getMessageCount", admin, getMessageCount);
export default router;
