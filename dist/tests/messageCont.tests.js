"use strict";
// import { Request, Response } from "express";
// import {
//   getAllMessages,
//   createMessage,
//   getMessageCount,
// } from "../src/controllers/messagesController"; // Assuming these functions are exported from messageHandlers.ts
// import Message from "../src/schemas/messageSchema";
// // Mock the message object
// const mockMessage = {
//   _id: "mockId",
//   email: "test@example.com",
//   message: "Test message",
// };
// // Mock the request and response objects
// const mockRequest = {} as Request;
// const mockResponse = {
//   status: jest.fn().mockReturnThis(),
//   json: jest.fn(),
//   send: jest.fn(),
// } as unknown as Response;
// jest.mock("../src/schemas/messageSchema", () => {
//   // Define mockMessage here
//   const mockMessage = {
//     _id: "mockId",
//     email: "test@example.com",
//     message: "Test message",
//   };
//   return {
//     find: jest.fn().mockResolvedValue([mockMessage]),
//     save: jest.fn().mockResolvedValue(mockMessage),
//     countDocuments: jest.fn().mockResolvedValue(1),
//   };
// });
// describe("getAllMessages", () => {
// //   it("should return all messages", async () => {
// //     await getAllMessages(mockRequest, mockResponse);
// //     expect(Message.find).toHaveBeenCalled();
// //     expect(mockResponse.status).toHaveBeenCalledWith(200);
// //     expect(mockResponse.json).toHaveBeenCalledWith([mockMessage]);
// //   });
// //   it("should handle errors", async () => {
// //     const errorMessage = "Database error";
// //     (Message.find as jest.Mock).mockRejectedValue(new Error(errorMessage));
// //     await getAllMessages(mockRequest, mockResponse);
// //     expect(mockResponse.status).toHaveBeenCalledWith(500);
// //     expect(mockResponse.send).toHaveBeenCalledWith("Internal Server Error");
// //   });
// });
// describe("createMessage", () => {
//   it("should create a new message", async () => {
//     const mockRequestBody = {
//       email: "test@example.com",
//       message: "Test message",
//     };
//     mockRequest.body = mockRequestBody;
//     await createMessage(mockRequest, mockResponse);
//     expect(Message.prototype.save).toHaveBeenCalled();
//     expect(mockResponse.status).toHaveBeenCalledWith(201);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       message: "Message created successfully",
//       newMessage: mockMessage,
//     });
//   });
// //   it("should handle errors", async () => {
// //     const errorMessage = "Database error";
// //     (Message.prototype.save as jest.Mock).mockRejectedValue(
// //       new Error(errorMessage)
// //     );
// //     await createMessage(mockRequest, mockResponse);
// //     expect(mockResponse.status).toHaveBeenCalledWith(500);
// //     expect(mockResponse.json).toHaveBeenCalledWith({
// //       error: "Internal Server Error",
// //     });
// //   });
// });
// describe("getMessageCount", () => {
//   it("should return the count of messages", async () => {
//     await getMessageCount(mockRequest, mockResponse);
//     expect(Message.countDocuments).toHaveBeenCalled();
//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//     expect(mockResponse.json).toHaveBeenCalledWith({ count: 1 });
//   });
// //   it("should handle errors", async () => {
// //     const errorMessage = "Database error";
// //     (Message.countDocuments as jest.Mock).mockRejectedValue(
// //       new Error(errorMessage)
// //     );
// //     await getMessageCount(mockRequest, mockResponse);
// //     expect(mockResponse.status).toHaveBeenCalledWith(500);
// //     expect(mockResponse.json).toHaveBeenCalledWith({
// //       message: "Internal Server Error",
// //     });
// //   });
// });
