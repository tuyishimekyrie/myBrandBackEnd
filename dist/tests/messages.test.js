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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../src/server");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const messageSchema_1 = __importDefault(require("../src/schemas/messageSchema"));
const userSchema_1 = __importDefault(require("../src/schemas/userSchema"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    server_1.servers;
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server_1.servers.close();
    // await mongoose.connection.close();
}));
// afterAll(async () => {
// });
describe("/", () => {
    describe("GET /api/messages", () => {
        it("should respond with 200 status code for getAll Messages Endpoint", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.servers).get("/");
            expect(response.status).toBe(200);
        }));
    });
});
// describe("get all messages", () => {
//   describe("GET /api/messages", () => {
//     it("should return all messages when authenticated", async () => {
//       // Assuming you have a valid authentication token for testing
//       const token = jwt.sign(
//         { userId: "65e4b26ae71bf7d92bbc32d7" },
//         config.get("jwtPrivateKey")
//       );
//       // Make a GET request to the getAllMessages endpoint with authentication token
//       const response = await supertest(servers)
//         .get("/api/messages/getALL")
//         .set("x-auth-token", `${token}`);
//       // Verify that the response status is 200
//       expect(response.status).toBe(200);
//       // Verify that the response body contains an array of messages
//       expect(Array.isArray(response.body)).toBe(true);
//       // Add more specific assertions if needed based on your message schema
//     });
//     it("should return 401 Unauthorized when not authenticated", async () => {
//       // Make a GET request to getAllMessages endpoint without authentication token
//       const response = await supertest(servers).get("/api/messages/getALL");
//       // Verify that the response status is 401
//       expect(response.status).toBe(401);
//     });
//   });
// });
describe("get messages count", () => {
    describe("GET /api/messages/getMessageCount", () => {
        it("should return the count of messages", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock an admin user
            const adminUser = new userSchema_1.default({ isAdmin: true });
            // Generate a JWT token for the admin user
            const token = jsonwebtoken_1.default.sign({ userId: adminUser._id, isAdmin: true }, config_1.default.get("jwtPrivateKey"));
            // Make a GET request to the getUserCount endpoint with authentication token
            const response = yield (0, supertest_1.default)(server_1.servers)
                .get("/api/messages/getMessageCount")
                .set("x-auth-token", `${token}`);
            // Verify that the response status is 200
            expect(response.status).toBe(200);
            // Verify that the response contains the count of users
            expect(response.body.count).toBeDefined();
            // Adjust the expected count based on your test environment
        }));
        it("should return 401 Unauthorized when not authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
            // Make a GET request to the getUserCount endpoint without authentication token
            const response = yield (0, supertest_1.default)(server_1.servers).get("/api/messages/getMessageCount");
            // Verify that the response status is 401
            expect(response.status).toBe(401);
        }));
        it("should return 500 if an internal server error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock an admin user
            const adminUser = new userSchema_1.default({ isAdmin: true });
            // Generate a JWT token for the admin user
            const token = jsonwebtoken_1.default.sign({ userId: adminUser._id, isAdmin: true }, config_1.default.get("jwtPrivateKey"));
            // Mock a function that throws an error when trying to delete a user
            jest
                .spyOn(messageSchema_1.default, "countDocuments")
                .mockRejectedValue(new Error("Something went wrong"));
            // Send a request to delete a user
            const response = yield (0, supertest_1.default)(server_1.servers)
                .get(`/api/messages/getMessageCount`)
                .set("x-auth-token", token);
            // Expecting a 500 Internal Server Error response
            expect(response.status).toBe(500);
            // Ensure the correct message is returned
            expect(response.body.message).toBe("Internal Server Error");
        }));
    });
});
describe("get all messages", () => {
    it("should return 401 Unauthorized when not authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Make a GET request to getAllMessages endpoint without authentication token
            const response = yield (0, supertest_1.default)(server_1.servers).get("/api/messages/getALL");
            // Verify that the response status is 401
            expect(response.status).toBe(401);
        }
        catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }));
    it("should return all messages when authenticated as admin", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Assuming you have a valid authentication token for testing
            const token = jsonwebtoken_1.default.sign({ userId: "adminUserId", isAdmin: true }, config_1.default.get("jwtPrivateKey"));
            // Make a GET request to getAllMessages endpoint with authentication token
            const response = yield (0, supertest_1.default)(server_1.servers)
                .get("/api/messages/getALL")
                .set("x-auth-token", `${token}`);
            // Verify that the response status is 200
            expect(response.status).toBe(200);
            // Verify that the response contains an array of messages
            expect(Array.isArray(response.body)).toBe(true);
            // Add more specific assertions if needed based on your message schema
        }
        catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }));
    it("should return 500 if an internal server error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        const adminUser = new userSchema_1.default({ isAdmin: true });
        const token = jsonwebtoken_1.default.sign({ _id: adminUser._id, isAdmin: true }, config_1.default.get("jwtPrivateKey"));
        jest
            .spyOn(messageSchema_1.default, "find")
            .mockRejectedValue(new Error("Something went wrong"));
        const response = yield (0, supertest_1.default)(server_1.servers)
            .get(`/api/messages/getALL`)
            .set("x-auth-token", token);
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal Server Error");
    }));
});
describe("POST /api/messages/create", () => {
    it("should return Message created successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.servers)
            .post("/api/messages/create")
            .send({
            email: "kyrieIrving23@gmail.com",
            message: "Hello 👋",
        });
        expect(response.status).toBe(201);
    }));
    it("should return 500 if an internal server error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.servers)
            .post("/api/messages/create")
            .send({});
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Internal Server Error");
    }));
});
