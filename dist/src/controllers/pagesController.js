"use strict";
// import { Request, Response } from "express";
// import User from "../schemas/userSchema";
// import z from "zod";
// import { UserDtos, userSchema } from "../Dtos/userDtos";
// import bcryptjs from "bcryptjs";
// import config from "config";
// import jwt from "jsonwebtoken";
// import { LoginDtos, loginSchema } from "../Dtos/loginDtos";
// export const registerUser = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password, confirmpassword } = userSchema.parse(
//       req.body
//     ) as UserDtos;
//     let existingUser = await User.findOne({ email: req.body.email });
//     if (existingUser) {
//       return res.status(400).send("User with this email already registered");
//     }
//     const salt = await bcryptjs.genSalt(10);
//     const hashedPassword = await bcryptjs.hash(req.body.password, salt);
//     const hashedConfirmpassword = await bcryptjs.hash(
//       req.body.confirmpassword,
//       salt
//     );
//     existingUser = new User({
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword,
//       confirmpassword: hashedConfirmpassword,
//       isAdmin: "false",
//     });
//     await existingUser.save();
//     const token = jwt.sign(
//       { _id: existingUser._id },
//       config.get("jwtPrivateKey")
//     );
//     // console.log(token)
//     res.header("x-auth-token", token).status(201).send({
//       email: existingUser.email,
//       password: existingUser.password,
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(400).send(error.message);
//     } else {
//       res.status(500).send("Internal Server Error");
//     }
//   }
// };
