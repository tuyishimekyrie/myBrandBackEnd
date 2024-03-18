import { Request, Response } from "express";
import User from "../schemas/userSchema";
import z from "zod";
import { UserDtos, userSchema } from "../Dtos/userDtos";
import bcryptjs from "bcryptjs";
import config from "config";
import jwt from "jsonwebtoken";

import { LoginDtos, loginSchema } from "../Dtos/loginDtos";

export const currentUser = async (req: Request, res: Response) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, config.get("jwtPrivateKey")) as {
      _id: string;
    };

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    // console.error("Error getting current user:", error);
    // res.status(500).json({ message: "Internal Server Error" });
    // console.log("Error getting current user:", error);
    res.send({ message: "Internal Server Error" });
  }
};

export const registerUserWithGoogle = async (req: Request, res: Response) => {
  
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    // const { name, email, password, confirmpassword } = userSchema.parse(
    //   req.body
    // ) as UserDtos;
 const { name, email, password, confirmpassword } =req.body
 
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("User with this email already registered");
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);
    const hashedConfirmpassword = await bcryptjs.hash(
      req.body.confirmpassword,
      salt
    );

    existingUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      confirmpassword: hashedConfirmpassword,
      isAdmin: "false",
    });

    await existingUser.save();

    const token = jwt.sign(
      { _id: existingUser._id },
      config.get("jwtPrivateKey")
    );
    // console.log(token)

    // res.header("x-auth-token", token).status(201).send({
    //   email: existingUser.email,
    //   password: existingUser.password,
    // });
    res.header("x-auth-token", token).status(201).json({message: "Successfully Created An Account"});
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body) as LoginDtos;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).send("Invalid email or password");
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(400).send("Invalid email or password");
    }

    const tokenPayload = {
      _id: existingUser._id,
      isAdmin: existingUser.isAdmin,
    };

    const token = jwt.sign(tokenPayload, config.get("jwtPrivateKey"));

    
    res.header("x-auth-token", token).status(200).json({ token, isAdmin: existingUser.isAdmin });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
   
    const users = await User.find({}, { password: 0 });

   
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    
    res.status(200).json({ users });
  } catch (error) {
    
    // console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
   
    const { id } = req.params;

   
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    await User.findByIdAndDelete(id);

   
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
  
    // console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getUserCount = async (req: Request, res: Response) => {
  try {
    const userCount = await User.countDocuments();

    
    res.status(200).json({ count: userCount });
  } catch (error) {
  
    // console.error("Error fetching user count:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
