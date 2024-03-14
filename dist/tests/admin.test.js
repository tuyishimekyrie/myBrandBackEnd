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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const admin_1 = __importDefault(require("../src/middleware/admin"));
describe("admin middleware", () => {
    let token;
    let privateKey;
    // Inside beforeEach or wherever you're creating the token
    beforeEach(() => {
        // Ensure config.get("jwtPrivateKey") returns a valid value
        const privateKey = config_1.default.get("jwtPrivateKey");
        if (!privateKey) {
            throw new Error("JWT private key is missing");
        }
        // Mock a valid authentication token for testing
        token = jsonwebtoken_1.default.sign({ userId: "65e9d33bf8762d0cbbde70b4", isAdmin: true }, privateKey, { expiresIn: "1h" } // Set expiration time
        );
    });
    //  it("should return 403 Forbidden when authenticated but not admin", async () => {
    //    // Mock a request object with a valid authentication token for a non-admin user
    //    const req: Partial<Request> = { headers: { "x-auth-token": token } };
    //    const res: Partial<Response> = {
    //      status: jest.fn().mockReturnThis(),
    //      send: jest.fn(),
    //    };
    //    const next: NextFunction = jest.fn();
    //    // Call the admin middleware
    //    admin(req as Request, res as Response, next);
    //    // Verify that res.status() and res.send() were called with the correct parameters
    //    expect(res.status).toHaveBeenCalledWith(403);
    //    expect(res.send).toHaveBeenCalledWith(
    //      "Access denied. User is not an admin."
    //    );
    //    // Verify that next() was not called
    //    expect(next).not.toHaveBeenCalled();
    //  });
    it("should grant access when authenticated as admin", () => __awaiter(void 0, void 0, void 0, function* () {
        // Make a mock request with a valid authentication token for an admin user
        const req = { header: () => token };
        const res = {};
        const next = jest.fn();
        // Call the admin middleware
        (0, admin_1.default)(req, res, next);
        // Verify that next() was called, indicating access is granted
        expect(next).toHaveBeenCalled();
    }));
    it("should return 401 Unauthorized when no token provided", () => __awaiter(void 0, void 0, void 0, function* () {
        // Make a mock request without an authentication token
        const req = { header: () => undefined };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();
        // Call the admin middleware
        (0, admin_1.default)(req, res, next);
        // Verify that res.status() and res.send() were called with the correct parameters
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Access denied, no token provided");
        // Verify that next() was not called
        expect(next).not.toHaveBeenCalled();
    }));
    //  it("should return 403 Forbidden when authenticated but not admin", async () => {
    //    // Mock a request with a valid authentication token for a non-admin user
    //    const req: any = { header: () => token };
    //    const res: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    //    const next = jest.fn();
    //    // Call the admin middleware
    //    admin(req, res, next);
    //    // Verify that res.status() and res.send() were called with the correct parameters
    //    expect(res.status).toHaveBeenCalledWith(403);
    //    expect(res.send).toHaveBeenCalledWith(
    //      "Access denied. User is not an admin."
    //    );
    //    // Verify that next() was not called
    //    expect(next).not.toHaveBeenCalled();
    //  });
    it("should return 401 Unauthorized when token is expired", () => __awaiter(void 0, void 0, void 0, function* () {
        // Make a mock request with an expired authentication token
        // Get the JWT private key from configuration
        const jwtPrivateKey = config_1.default.get("jwtPrivateKey");
        // Check if jwtPrivateKey is defined
        if (!jwtPrivateKey) {
            throw new Error("JWT private key is missing");
        }
        // Sign the payload with the JWT private key
        const expiredToken = jsonwebtoken_1.default.sign({ userId: "65e9d33bf8762d0cbbde70b4", isAdmin: true }, jwtPrivateKey, { expiresIn: "-1s" } // Expired token
        );
        const req = { header: () => expiredToken };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();
        // Call the admin middleware
        (0, admin_1.default)(req, res, next);
        // Verify that res.status() and res.send() were called with the correct parameters
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Access token expired");
        // Verify that next() was not called
        expect(next).not.toHaveBeenCalled();
    }));
    it("should return 400 Bad Request when token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        // Make a mock request with an invalid authentication token
        const invalidToken = "invalid_token";
        const req = { header: () => invalidToken };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();
        // Call the admin middleware
        (0, admin_1.default)(req, res, next);
        // Verify that res.status() and res.send() were called with the correct parameters
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Invalid token");
        // Verify that next() was not called
        expect(next).not.toHaveBeenCalled();
    }));
    it("should return 500 Internal Server Error when an unexpected error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        // Make a mock request with a valid authentication token
        const req = { header: () => token };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn(() => {
            throw new Error("Unexpected error");
        });
        // Call the admin middleware
        (0, admin_1.default)(req, res, next);
        // Verify that res.status() and res.send() were called with the correct parameters
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Internal Server Error");
        // Verify that next() was called
        expect(next).toHaveBeenCalled();
    }));
});
