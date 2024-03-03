"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @openapi
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the blog.
 *         readMoreURL:
 *           type: string
 *           description: The URL for reading more about the blog.
 *         img:
 *           type: string
 *           minLength: 5
 *           maxLength: 1024
 *           description: The URL of the image associated with the blog.
 *         likesCount:
 *           type: number
 *           description: The number of likes received for the blog.
 *         likedBy:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of user IDs who liked the blog.
 *         header:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           description: The header/title of the blog.
 *         desc:
 *           type: string
 *           minLength: 5
 *           maxLength: 255
 *           description: The description of the blog.
 *         commentsCount:
 *           type: number
 *           description: The number of comments received for the blog.
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               commenterId:
 *                 type: string
 *                 description: The ID of the commenter.
 *               commenterName:
 *                 type: string
 *                 description: The name of the commenter.
 *               comment:
 *                 type: string
 *                 description: The comment made by the commenter.
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date when the comment was posted.
 *               time:
 *                 type: string
 *                 description: The time when the comment was posted.
 *       required:
 *         - img
 *         - header
 *         - desc
 *       example:
 *         _id: 60e97c9fcf5c026b848860d3
 *         img: https://example.com/image.jpg
 *         likesCount: 10
 *         header: Example Blog Header
 *         desc: This is an example blog description.
 *         commentsCount: 3
 *         comments:
 *           - commenterId: 60e97c9fcf5c026b848860d3
 *             commenterName: John Doe
 *             comment: This is a comment.
 *             date: "2022-07-09T12:34:56.789Z"
 *             time: "12:34:56 PM"
 */
exports.blogSchema = new mongoose_1.default.Schema({
    readMoreURL: {
        type: String,
    },
    img: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    likedBy: [{ type: String }],
    header: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
    },
    desc: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            commenterId: {
                type: String,
            },
            commenterName: {
                type: String,
            },
            comment: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
                default: Date.now,
            },
            time: {
                type: String,
                required: true,
                default: () => new Date().toLocaleTimeString(),
            },
        },
    ],
});
const Blog = mongoose_1.default.model("Blog", exports.blogSchema);
exports.default = Blog;
