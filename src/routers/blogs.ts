import express, { Request, NextFunction, Response } from "express";
import {
  deleteBlog,
  listBlogs,
  updateLikes,
  addComment,
} from "../controllers/blogsController";
import admin from "../middleware/admin";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Blog from "../schemas/blogSchema";
import auth from "../middleware/auth";

const router = express.Router();
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
router.get("/", listBlogs);
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

router.delete("/delete/:id", admin, deleteBlog);
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

router.patch("/likes/:id/like", auth, updateLikes);
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
router.post("/:id/comments", addComment);

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    const uploadDir = "uploads/";

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    cb(null, uploadDir);
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

cloudinary.config({
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


router.post(
  "/upload",
  upload.single("image"),
  admin,
  async function (req: Request, res: Response) {
    try {
      // Check if req.file exists
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image uploaded",
        });
      }

      // Upload image to Cloudinary
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

      // Create a new blog post with default and supplied properties
      const newBlog = new Blog({
        img: cloudinaryResult.secure_url, // Image URL from Cloudinary
        header: req.body.headline || "Default Headline",
        desc: req.body.description || "Default Description",
        ...req.body, // Include other properties from the request body
      });

      // Save the new blog post to the database
      const savedBlog = await newBlog.save();

      res.status(200).json({
        success: true,
        message: "Blog post created successfully",
        // data: savedBlog,
      });
    } catch (error) {
      console.error("Error uploading image and creating blog post:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);
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


router.patch(
  "/updates/:id",
  admin,
  upload.single("image"),
  async function (req: Request, res: Response) {
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

      const existingBlog = await Blog.findById(id);
      if (!existingBlog) {
        return res.status(404).send("Blog not found");
      }

      if (header !== undefined) {
        existingBlog.header = header;
      }
      if (desc !== undefined) {
        existingBlog.desc = desc;
      }

      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
      existingBlog.img = cloudinaryResult.secure_url; 

      const updatedBlog = await existingBlog.save();

      res.status(200).json({
        success: true,
        message: "Blog post updated successfully",
        data: updatedBlog, 
      });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

export default router;
