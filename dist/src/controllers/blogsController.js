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
exports.addComment = exports.updateLikes = exports.deleteBlog = exports.listBlogs = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const blogSchema_1 = __importDefault(require("../schemas/blogSchema"));
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const config_1 = __importDefault(require("config"));
const userSchema_1 = __importDefault(require("../schemas/userSchema"));
const listBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield blogSchema_1.default.find();
        res.status(200).json(blogs);
    }
    catch (error) {
        console.error("Error listing blogs:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.listBlogs = listBlogs;
// Configure Cloudinary (ensure you have installed and imported the cloudinary package)
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: "dvr0mdz82",
    api_key: "969194347389653",
    api_secret: "bgI8JqdCH_bf5H-P-9i0p52WlqE",
});
// export const createBlog = async (req: Request, res: Response) => {
//   try {
//     const { header, desc } = req.body;
//     // Check if file is uploaded
//     const imageFile = req.files?.file;
//     if (!imageFile) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No image uploaded" });
//     }
//     // Handle multiple uploaded files
//     const image = Array.isArray(imageFile) ? imageFile[0] : imageFile;
//     // Upload image to Cloudinary
//     const result = await cloudinary.uploader.upload(image.tempFilePath);
//     // Create blog object with image URL and other details
//     const blog = {
//       header,
//       desc,
//       img: result.secure_url, // Image URL from Cloudinary
//       // Add other details as needed
//     };
//     // Save blog to database or perform other actions
//     // Example: await BlogModel.create(blog);
//     res.status(201).json({
//       success: true,
//       message: "Blog created successfully",
//       data: blog,
//     });
//   } catch (error) {
//     console.error("Error creating blog:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
// Multer configuration for file uploads
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
// export const updateBlog = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params; // Extract the ID of the blog from the request parameters
//     const { header, desc } = req.body; // Extract the updated data from the request body
//     // Check if the blog with the given ID exists
//     const existingBlog = await Blog.findById(id);
//     if (!existingBlog) {
//       return res.status(404).send("Blog not found");
//     }
//     // Update the existing blog with the new data, if provided
//     if (header !== undefined) {
//       existingBlog.header = header;
//     }
//     if (desc !== undefined) {
//       existingBlog.desc = desc;
//     }
//     // Check if a new image file is uploaded
//     if (req.file) {
//       // If a new image is provided, upload it to Cloudinary and update the img field
//       const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
//       existingBlog.img = cloudinaryResult.secure_url;
//     }
//     // Save the updated blog to the database
//     const updatedBlog = await existingBlog.save();
//     res.status(200).send(updatedBlog); // Send back the updated blog as response
//   } catch (error) {
//     console.error("Error updating blog:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };
// Configure Cloudinary
// export const updateBlog = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params; // Extract the ID of the blog from the request parameters
//     const { header, desc } = req.body; // Extract the updated data from the request body
//     // Check if the blog with the given ID exists
//     const existingBlog = await Blog.findById(id);
//     if (!existingBlog) {
//       return res.status(404).send("Blog not found");
//     }
//     // Check if a new image file is uploaded
//     if (req.file) {
//       // If a new image is provided, upload it to Cloudinary
//       const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
//       existingBlog.img = cloudinaryResult.secure_url;
//     }
//     // Update the existing blog with the new data, if provided
//     if (header !== undefined) {
//       existingBlog.header = header;
//     }
//     if (desc !== undefined) {
//       existingBlog.desc = desc;
//     }
//     // Save the updated blog to the database
//     const updatedBlog = await existingBlog.save();
//     res.status(200).send(updatedBlog); // Send back the updated blog as response
//   } catch (error) {
//     console.error("Error updating blog:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Extract the ID of the blog from the request parameters
        // Check if the blog with the given ID exists
        const existingBlog = yield blogSchema_1.default.findById(id);
        if (!existingBlog) {
            return res.status(404).send("Blog not found");
        }
        // If the blog exists, delete it from the database
        yield blogSchema_1.default.findByIdAndDelete(id);
        res.status(200).send("Blog deleted successfully");
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
exports.deleteBlog = deleteBlog;
// export const updateLikes = async (req: Request, res: Response) => {
//   const { id } = req.params; // Extract the ID of the blog from the request parameters
//   const { userId } = req.body; // Extract the user ID from the request body
//   try {
//     // Find the blog post by ID
//     const blog = await Blog.findById(id);
//     if (!blog) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Blog not found" });
//     }
//     // Check if the user already liked the blog post
//     if (blog.likedBy.includes(userId)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User already liked this blog" });
//     }
//     // Update likes count and add user ID to likedBy array
//     blog.likesCount += 1;
//     blog.likedBy.push(userId);
//     // Save the updated blog post
//     const updatedBlog = await blog.save();
//     res
//       .status(200)
//       .json({
//         success: true,
//         message: "Blog liked successfully",
//         data: updatedBlog,
//       });
//   } catch (error) {
//     console.error("Error liking blog:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
const updateLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const token = req.header("x-auth-token");
    try {
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "Access denied. No token provided." });
        }
        const jwtPrivateKey = config_1.default.get("jwtPrivateKey");
        if (!jwtPrivateKey) {
            return res.status(500).json({
                success: false,
                message: "Internal server error. JWT private key is missing.",
            });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, jwtPrivateKey);
        const userId = decodedToken._id;
        const blog = yield blogSchema_1.default.findById(id);
        if (!blog) {
            return res
                .status(404)
                .json({ success: false, message: "Blog not found" });
        }
        const likedIndex = blog.likedBy.indexOf(userId);
        if (likedIndex !== -1) {
            blog.likedBy.splice(likedIndex, 1);
            blog.likesCount -= 1;
        }
        else {
            blog.likedBy.push(userId);
            blog.likesCount += 1;
        }
        yield blog.save();
        // Send response indicating success or failure
        return res.status(200).json({
            success: true,
            message: "Blog like updated successfully",
            liked: likedIndex === -1, // Indicates whether the user liked or unliked the blog
        });
    }
    catch (error) {
        console.error("Error updating blog like:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
});
exports.updateLikes = updateLikes;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { comment } = req.body;
    const token = req.header("x-auth-token");
    try {
        // Check if token is provided
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "Access denied. No token provided." });
        }
        // Verify the JWT token and extract user ID
        const jwtPrivateKey = config_1.default.get("jwtPrivateKey");
        if (!jwtPrivateKey) {
            return res.status(500).json({
                success: false,
                message: "Internal server error. JWT private key is missing.",
            });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token.replace("Bearer ", ""), jwtPrivateKey);
        const commenterId = decodedToken._id;
        // Find the blog post by ID
        const blog = yield blogSchema_1.default.findById(id);
        const user = yield userSchema_1.default.findById(commenterId).select("name");
        const commenterName = user === null || user === void 0 ? void 0 : user.name;
        console.log(commenterId);
        console.log(decodedToken);
        if (!blog) {
            return res
                .status(404)
                .json({ success: false, message: "Blog not found" });
        }
        // Construct the new comment object
        const newComment = {
            commenterId,
            comment,
            commenterName,
            date: new Date(),
            time: new Date().toLocaleTimeString(),
        };
        // Add the comment to the blog post
        blog.comments.push(newComment);
        // Increment the commentsCount
        blog.commentsCount++;
        // Save the updated blog post
        yield blog.save();
        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: newComment,
        });
    }
    catch (error) {
        console.error("Error adding comment:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
});
exports.addComment = addComment;
