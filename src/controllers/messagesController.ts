import { Request, Response } from "express";
import Message from "../schemas/messageSchema";

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find();

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error listing messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const createMessage = async (req: Request, res: Response) => {
  try {
    // Extract email and message from request body
    const { email, message } = req.body;

    // Create a new message instance
    const newMessage = new Message({ email, message });

    // Save the message to the database
    await newMessage.save();

    // Send a success response
    res
      .status(201)
      .json({ message: "Message created successfully", newMessage });
  } catch (error) {
    // Handle errors
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Define the route handler function
export const getMessageCount = async (req: Request, res: Response) => {
  try {
    // Fetch the count of users from the database
    const messageCount = await Message.countDocuments();

    // Send the count as a JSON response
    res.status(200).json({ count: messageCount });
  } catch (error) {
    // Handle errors
    console.error("Error fetching message count:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
