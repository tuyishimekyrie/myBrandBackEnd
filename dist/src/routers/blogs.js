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
const express_1 = __importDefault(require("express"));
const blogsController_1 = require("../controllers/blogsController");
const admin_1 = __importDefault(require("../middleware/admin"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const blogSchema_1 = __importDefault(require("../schemas/blogSchema"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
/**
 * @openapi
 * /api/blogs:
 *   get:
 *     tags:
 *       - Blogs
 *     summary: Get all blogs
 *     description: Retrieves a list of all blogs.
 *     security:
 *       - bearerAuth: []
 *       - adminAuth: []
 *     responses:
 *       '200':
 *         description: List of blogs retrieved successfully
 *       '401':
 *         description: Unauthorized - user authentication failed
 *       '403':
 *         description: Forbidden - user is not an admin
 */
router.get("/", blogsController_1.listBlogs);
/**
 * @openapi
 * /api/blogs/delete/{id}:
 *   delete:
 *     tags:
 *       - Blogs
 *     summary: Delete a blog
 *     description: Deletes a blog with the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog to delete.
 *     security:
 *       - bearerAuth: []
 *       - adminAuth: []
 *     responses:
 *       '204':
 *         description: Blog deleted successfully
 *       '401':
 *         description: Unauthorized - user authentication failed
 *       '403':
 *         description: Forbidden - user is not an admin
 */
router.delete("/delete/:id", admin_1.default, blogsController_1.deleteBlog);
/**
 * @openapi
 * /api/blogs/likes/{id}/like:
 *   patch:
 *     tags:
 *       - Blogs
 *     summary: Like a blog
 *     description: Increments the like count of the blog with the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog to like.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Blog liked successfully
 *       '401':
 *         description: Unauthorized - user authentication failed
 */
router.patch("/likes/:id/like", auth_1.default, blogsController_1.updateLikes);
/**
 * @openapi
 * /api/blogs/{id}/comments:
 *   post:
 *     tags:
 *       - Blogs
 *     summary: Add a comment to a blog
 *     description: Adds a comment to the blog with the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog to add a comment to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *             required:
 *               - comment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: Comment added successfully
 *       '401':
 *         description: Unauthorized - user authentication failed
 *       '404':
 *         description: Blog not found
 */
router.post("/:id/comments", blogsController_1.addComment);
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "uploads/";
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
cloudinary_1.v2.config({
    cloud_name: "dvr0mdz82",
    api_key: "969194347389653",
    api_secret: "bgI8JqdCH_bf5H-P-9i0p52WlqE",
});
// router.post(
//   "/upload",
//   upload.single("image"),
//   function (req: Request, res: Response) {
//     if (req.file) {
//       cloudinary.uploader.upload(
//         req.file.path,
//         function (err: any, result: any) {
//           if (err) {
//             console.log(err);
//             return res.status(500).json({
//               success: false,
//               message: "Error",
//             });
//           }
//           res.status(200).json({
//             success: true,
//             message: "Uploaded!",
//             data: result,
//           });
//         }
//       );
//     }
//   }
// );
/**
 * @openapi
 * info:
 *   title: Blog API
 *   description: API for managing blog posts and images
 *   version: 1.0.0
 * paths:
 *   /api/blogs/upload:
 *     post:
 *       tags:
 *         - Blogs
 *       summary: Upload an image and create a blog post
 *       description: Uploads an image and creates a blog post with the provided data.
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   format: binary
 *                 header:
 *                   type: string
 *                   description: Header for the blog post
 *                 desc:
 *                   type: string
 *                   description: Description for the blog post
 *       security:
 *         - bearerAuth: []
 *         - adminAuth: []
 *       responses:
 *         '200':
 *           description: Blog post created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     description: Indicates whether the operation was successful.
 *                   message:
 *                     type: string
 *                     description: Confirmation message.
 *         '400':
 *           description: Bad request - no image uploaded
 *         '500':
 *           description: Internal Server Error
 * security:
 *   - bearerAuth: []
 *   - adminAuth: []
 */
router.post("/upload", upload.single("image"), admin_1.default, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check if req.file exists
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No image uploaded",
                });
            }
            // Upload image to Cloudinary
            const cloudinaryResult = yield cloudinary_1.v2.uploader.upload(req.file.path);
            // Create a new blog post with default and supplied properties
            const newBlog = new blogSchema_1.default(Object.assign({ img: cloudinaryResult.secure_url, header: req.body.headline || "Default Headline", desc: req.body.description || "Default Description" }, req.body));
            // Save the new blog post to the database
            const savedBlog = yield newBlog.save();
            res.status(200).json({
                success: true,
                message: "Blog post created successfully",
                // data: savedBlog,
            });
        }
        catch (error) {
            console.error("Error uploading image and creating blog post:", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    });
});
/**
 * @openapi
 * info:
 *   title: Blog API
 *   description: API for managing blog posts and images
 *   version: 1.0.0
 * paths:
 *   /api/blogs/updates/{id}:
 *     patch:
 *       tags:
 *         - Blogs
 *       summary: Upload an image and create a blog post
 *       description: Uploads an image and creates a blog post with the provided data.
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the blog to update.
 *       requestBody:
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   format: binary
 *                 header:
 *                   type: string
 *                   description: Header for the blog post. (Optional)
 *                 desc:
 *                   type: string
 *                   description: Description for the blog post. (Optional)
 *       security:
 *         - bearerAuth: []
 *         - adminAuth: []
 *       responses:
 *         '200':
 *           description: Blog post created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     description: Indicates whether the operation was successful.
 *                   message:
 *                     type: string
 *                     description: Confirmation message.
 *         '400':
 *           description: Bad request - no image uploaded
 *         '500':
 *           description: Internal Server Error
 * security:
 *   - bearerAuth: []
 *   - adminAuth: []
 */
router.patch("/updates/:id", admin_1.default, upload.single("image"), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check if req.file exists
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No image uploaded",
                });
            }
            const { id } = req.params;
            const { header, desc } = req.body;
            const existingBlog = yield blogSchema_1.default.findById(id);
            if (!existingBlog) {
                return res.status(404).send("Blog not found");
            }
            if (header !== undefined) {
                existingBlog.header = header;
            }
            if (desc !== undefined) {
                existingBlog.desc = desc;
            }
            const cloudinaryResult = yield cloudinary_1.v2.uploader.upload(req.file.path);
            existingBlog.img = cloudinaryResult.secure_url;
            const updatedBlog = yield existingBlog.save();
            res.status(200).json({
                success: true,
                message: "Blog post updated successfully",
                data: updatedBlog,
            });
        }
        catch (error) {
            console.error("Error updating blog:", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    });
});
exports.default = router;
