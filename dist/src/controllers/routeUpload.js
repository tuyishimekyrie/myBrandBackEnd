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
exports.createOrUpdateBlogWithImage = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const blogSchema_1 = __importDefault(require("../schemas/blogSchema"));
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
// Function to create or update a blog post with an image
const createOrUpdateBlogWithImage = (req, res, id // Optional parameter for blog post ID
) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let existingBlog = null; // Initialize existingBlog as null
        if (id) {
            // If ID is provided, update existing blog post
            existingBlog = yield blogSchema_1.default.findById(id);
            if (!existingBlog) {
                return res.status(404).send("Blog not found");
            }
        }
        const { header, desc } = req.body; // Extract the updated data from the request body
        // Update the existing blog with the new data, if provided
        if (existingBlog) {
            if (header !== undefined) {
                existingBlog.header = header;
            }
            if (desc !== undefined) {
                existingBlog.desc = desc;
            }
        }
        // Check if a new image file is uploaded
        if (req.file) {
            // If a new image is provided, upload it to Cloudinary and update the img field
            const cloudinaryResult = yield cloudinary_1.v2.uploader.upload(req.file.path);
            if (existingBlog) {
                existingBlog.img = cloudinaryResult.secure_url;
            }
            else {
                // If no existing blog post (creating a new one), create a new blog post object
                existingBlog = new blogSchema_1.default({
                    img: cloudinaryResult.secure_url,
                    header: header || "Default Header",
                    desc: desc || "Default Description",
                });
            }
        }
        // Save the updated or new blog to the database
        const updatedOrNewBlog = yield (existingBlog === null || existingBlog === void 0 ? void 0 : existingBlog.save());
        res.status(200).send(updatedOrNewBlog); // Send back the updated or new blog as response
    }
    catch (error) {
        console.error("Error creating/updating blog:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.createOrUpdateBlogWithImage = createOrUpdateBlogWithImage;
