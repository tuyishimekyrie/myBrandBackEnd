import { Request, Response } from "express";
import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import Blog from "../schemas/blogSchema"; 

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Function to create or update a blog post with an image
export const createOrUpdateBlogWithImage = async (
  req: Request,
  res: Response,
  id?: string // Optional parameter for blog post ID
) => {
  try {
    let existingBlog = null; // Initialize existingBlog as null

    if (id) {
      // If ID is provided, update existing blog post
      existingBlog = await Blog.findById(id);
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
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
      if (existingBlog) {
        existingBlog.img = cloudinaryResult.secure_url;
      } else {
        // If no existing blog post (creating a new one), create a new blog post object
        existingBlog = new Blog({
          img: cloudinaryResult.secure_url,
          header: header || "Default Header",
          desc: desc || "Default Description",
        });
      }
    }

    // Save the updated or new blog to the database
    const updatedOrNewBlog = await existingBlog?.save();

    res.status(200).send(updatedOrNewBlog); // Send back the updated or new blog as response
  } catch (error) {
    console.error("Error creating/updating blog:", error);
    res.status(500).send("Internal Server Error");
  }
};
