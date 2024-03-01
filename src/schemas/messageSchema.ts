import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the message.
 *         email:
 *           type: string
 *           minLength: 5
 *           maxLength: 50
 *           description: The email of the sender.
 *         message:
 *           type: string
 *           minLength: 3
 *           maxLength: 150
 *           description: The message content.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the message was created.
 *       required:
 *         - email
 *         - message
 *       example:
 *         _id: 60e97c9fcf5c026b848860d3
 *         email: example@example.com
 *         message: This is a sample message.
 *         createdAt: "2022-07-09T12:34:56.789Z"
 */
export const messageSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  message: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 150,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
