"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Mock the response and next function for middleware testing
const res = {};
const next = jest.fn();
describe("auth middleware", () => {
    //   it("should return 401 if no token is provided", async () => {
    //     const req = { header: jest.fn().mockReturnValue(undefined) } as any;
    //     await auth(req, res, next);
    //     expect(res.status).toHaveBeenCalledWith(401);
    //     expect(res.send).toHaveBeenCalledWith("Access denied, no token provided");
    //   });
    //   it("should return 401 if token is expired", async () => {
    //     const token = jwt.sign({ userId: "user123" }, "invalidSecret", {
    //       expiresIn: "0s",
    //     });
    //     const req = { header: jest.fn().mockReturnValue("Bearer " + token) } as any;
    //     await auth(req, res, next);
    //     expect(res.status).toHaveBeenCalledWith(401);
    //     expect(res.send).toHaveBeenCalledWith("Access token expired");
    //   });
    //   it("should return 400 if token is invalid", async () => {
    //     const token = "invalidToken";
    //     const req = { header: jest.fn().mockReturnValue("Bearer " + token) } as any;
    //     await auth(req, res, next);
    //     expect(res.status).toHaveBeenCalledWith(400);
    //     expect(res.send).toHaveBeenCalledWith("Invalid token");
    //   });
    //   it("should set req.user if token is valid", async () => {
    //     const token = jwt.sign({ userId: "user123" }, config.get("jwtPrivateKey"));
    //     const req = { header: jest.fn().mockReturnValue("Bearer " + token) } as any;
    //     await auth(req, res, next);
    //     expect(req.user).toEqual({ userId: "user123" });
    //     expect(next).toHaveBeenCalled();
    //   });
    //   it("should return 500 if an unexpected error occurs", async () => {
    //     const req = {
    //       header: jest.fn().mockReturnValue("Bearer " + "validToken"),
    //     } as any;
    //     jwt.verify = jest.fn().mockImplementation(() => {
    //       throw new Error("Unexpected error");
    //     });
    //     await auth(req, res, next);
    //     expect(res.status).toHaveBeenCalledWith(500);
    //     expect(res.send).toHaveBeenCalledWith("Internal Server Error");
    //   });
});
