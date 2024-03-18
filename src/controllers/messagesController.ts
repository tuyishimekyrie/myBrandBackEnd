import { Request, Response } from "express";
import Message from "../schemas/messageSchema";

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find();

    const reversedMessages = messages.reverse();

    res.status(200).json(reversedMessages);
  } catch (error) {
    // console.error("Error listing messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const createMessage = async (req: Request, res: Response) => {
  try {
    const { email, message } = req.body;

    const newMessage = new Message({ email, message });

    await newMessage.save();

    res
      .status(201)
      .json({ message: "Message created successfully", newMessage });
  } catch (error) {
    // console.error("Error creating message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getMessageCount = async (req: Request, res: Response) => {
  try {
    const messageCount = await Message.countDocuments();

    res.status(200).json({ count: messageCount });
  } catch (error) {
    // console.error("Error fetching message count:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
