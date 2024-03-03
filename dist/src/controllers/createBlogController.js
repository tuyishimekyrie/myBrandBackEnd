"use strict";
// import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
// import { NextFunction, Request, Response } from "express";
// const destinationFolder = "uploads/";
// // Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Specify destination folder for uploaded files
//     cb(null, destinationFolder);
//   },
//   filename: function (req, file, cb) {
//     // Generate unique filename for uploaded files
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB, adjust as needed
//   },
// });
// // Configure Cloudinary (Replace placeholder strings with your Cloudinary credentials)
// cloudinary.config({
//   cloud_name: "dvr0mdz82",
//   api_key: "969194347389653",
//   api_secret: "bgI8JqdCH_bf5H-P-9i0p52WlqE",
// });
// // Define the createBlog function
// export const createBlog = async (req: Request, res: Response) => {
//   try {
//     // Use upload.single('image') middleware to handle single file upload
//     upload.single("image")(req, res, function (err) {
//       if (err) {
//         console.log("errors" + err);
//         return res
//           .status(400)
//           .json({ success: false, message: "Error uploading image Multer" });
//       }
//       // At this point, the file has been uploaded successfully
//         const imageFile = req.files?.image as unknown as Express.Multer.File;
//         console.log(imageFile)
//       if (!imageFile) {
//         return res
//           .status(400)
//           .json({ success: false, message: "No image uploaded" });
//       }
//       // Use cloudinary.uploader.upload to upload the file to Cloudinary
//       cloudinary.uploader.upload(imageFile.path, function (error:any, result: any) {
//         if (error) {
//           console.error(error);
//           return res
//             .status(500)
//             .json({ success: false, message: "Error uploading image cloudinary" });
//         }
//         // Process the uploaded file (e.g., save it to a database, store it in cloud storage)
//         // Here, we're just sending back a success response with the filename
//         res.status(200).json({
//           success: true,
//           filename: result.original_filename,
//           cloudinaryData: result,
//         });
//       });
//     });
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
