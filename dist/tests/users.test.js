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
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const userSchema_1 = __importDefault(require("../src/schemas/userSchema"));
let app;
const removeUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userSchema_1.default.deleteOne({ email });
    }
    catch (error) {
        console.error("Error removing user by email:", error);
        throw error;
    }
});
// Mock User model methods
// jest.mock("../src/schemas/userSchema.ts", () => ({
//   findById: jest.fn(),
// }));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    server_1.servers;
    // await User.deleteOne({ "user1@example.com"});
    yield removeUserByEmail("user1@example.com");
    yield removeUserByEmail("user2@example.com");
    yield removeUserByEmail("john@example.com");
    yield removeUserByEmail("kyrieIrving23@gmail.com");
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    server_1.servers.close();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("/api/users", () => {
    describe("GET /", () => {
        it("should respond with 200 status code for root endpoint", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.servers).get("/");
            expect(response.status).toBe(200);
        }));
    });
});
describe("POST /api/users/create", () => {
    it("should return successfully created an account", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.servers).post("/api/users/create").send({
            name: "Irving23",
            email: "kyrieIrving23@gmail.com",
            password: "1234567",
            confirmpassword: "1234567",
            isAdmin: "false",
        });
        expect(response.status).toBe(201);
    }));
    it('should return 201 with "Successfully Created An Account" message for valid registration', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock request and response objects
        const data = {
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            confirmpassword: "password123",
            isAdmin: "false",
        };
        const response = yield (0, supertest_1.default)(server_1.servers)
            .post("/api/users/create")
            .send(data);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Successfully Created An Account");
    }));
    it("should return 400 if user with the provided email already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        // // Mock an existing user with the provided email
        // const existingUser = new User({
        //   name: "User 6",
        //   email: "user6@example.com", // Use the same email as the existing user
        //   password: "password2",
        //   confirmpassword: "password2",
        // });
        // await existingUser.save();
        // Make a POST request to register a new user with the same email
        const response = yield (0, supertest_1.default)(server_1.servers).post("/api/users/create").send({
            name: "User 6",
            email: "user6@example.com", // Use the same email as the existing user
            password: "password2",
            confirmpassword: "password2",
        });
        // Expect response status code to be 400 (Bad Request)
        expect(response.statusCode).toBe(400);
        // Expect response body to contain a message indicating the user already exists
        expect(response.text).toBe("User with this email already registered");
    }));
    it('should return 400 with "Failed Created An Account" message for valid registration', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock request and response objects
        const data = {
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            // confirmpassword: "password123",
            // isAdmin: "false",
        };
        const response = yield (0, supertest_1.default)(server_1.servers)
            .post("/api/users/create")
            .send(data);
        expect(response.status).toBe(400);
        // expect(response.body.message).toBe("Successfully Created An Account");
    }));
    it("should return 500 if an internal server error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock an admin user
        const userId = "65eaf11edd40e6f117d288da"; // Replace this with your actual user ID
        const token = jsonwebtoken_1.default.sign({ _id: userId }, config_1.default.get("jwtPrivateKey"));
        // Mock a function that throws an error when trying to delete a user
        jest
            .spyOn(userSchema_1.default, "findOne")
            .mockRejectedValue(new Error("Something went wrong"));
        // Send a request to delete a user
        const response = yield (0, supertest_1.default)(server_1.servers)
            .get(`/api/users/create`)
            .set("x-auth-token", token);
        // Expecting a 500 Internal Server Error response
        expect(response.status).toBe(500);
        // Ensure the correct message is returned
        // expect(response.body.message).toBe("Internal Server Error");
    }));
});
describe("GET /getALL", () => {
    it("should return 401 if user is not authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
        // Send a request without authentication
        const response = yield (0, supertest_1.default)(server_1.servers).get("/api/users/getALL");
        // Expecting a 401 Unauthorized response
        expect(response.status).toBe(401);
    }));
    it("should return 403 if user is authenticated but not an admin", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock a regular user
        const user = new userSchema_1.default({ isAdmin: false });
        // Generate a JWT token for the regular user
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.default.get("jwtPrivateKey"));
        // Send a request with the token
        const response = yield (0, supertest_1.default)(server_1.servers)
            .get("/api/users/getALL")
            .set("x-auth-token", token);
        // Expecting a 403 Forbidden response
        expect(response.status).toBe(403);
    }));
    it("should return 200 with users if user is authenticated and an admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const adminUser = new userSchema_1.default();
        const token = jsonwebtoken_1.default.sign({ userId: adminUser._id, isAdmin: true }, config_1.default.get("jwtPrivateKey"));
        const mockUsers = [
            {
                name: "User1",
                email: "user1@example.com",
                password: "password1",
                confirmpassword: "password1",
            },
            // {
            //   name: "User2",
            //   email: "user2@example.com",
            //   password: "password2",
            //   confirmpassword: "password2",
            // },
        ];
        // await User.insertMany(mockUsers);
        const response = yield (0, supertest_1.default)(server_1.servers)
            .get("/api/users/getALL")
            .set("x-auth-token", token);
        expect(response.status).toBe(200);
        expect(response.body.users).toBeDefined();
        expect(Array.isArray(response.body.users)).toBe(true);
        // expect(response.body.users.length).toBe(2);
    }));
    //  it("should return 404 when no users are found", async () => {
    //    // Clear existing users from the database
    //    await User.deleteMany({});
    //    // Make a GET request to the route
    //    const response = await supertest(servers).get("/api/users/getALL");
    //    // Expect response status code to be 404 (Not Found)
    //    expect(response.statusCode).toBe(404);
    //    // Expect response body to contain a message indicating no users found
    //    expect(response.body.message).toBe("No users found");
    //  });
    it("should return 500 if an internal server error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock an admin user
        const adminUser = new userSchema_1.default({ isAdmin: true });
        // Generate a JWT token for the admin user
        const token = jsonwebtoken_1.default.sign({ userId: adminUser._id, isAdmin: true }, config_1.default.get("jwtPrivateKey"));
        // Mock the User.find method to throw an error
        jest
            .spyOn(userSchema_1.default, "find")
            .mockRejectedValue(new Error("Something went wrong"));
        // Send a request to get all users
        const response = yield (0, supertest_1.default)(server_1.servers)
            .get("/api/users/getAll")
            .set("x-auth-token", token);
        // Expecting a 500 Internal Server Error response
        expect(response.status).toBe(500);
        // Ensure the correct message is returned
        expect(response.body.message).toBe("Internal Server Error");
    }));
});
describe("DELETE /api/users/delete/{id}", () => {
    it("should return 200 with users if user is deleted successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock an admin user
        const adminUser = new userSchema_1.default({ isAdmin: true });
        // Generate a JWT token for the admin user
        const token = jsonwebtoken_1.default.sign({ _id: adminUser._id, isAdmin: true }, config_1.default.get("jwtPrivateKey"));
        // Mock some users in the database
        const mockUsers = [
            {
                name: "User1",
                email: "user1@example.com",
                password: "password1",
                confirmpassword: "password1",
            },
            {
                name: "User2",
                email: "user2@example.com",
                password: "password2",
                confirmpassword: "password2",
            },
        ];
        const insertedUser = yield userSchema_1.default.insertMany(mockUsers);
        // Send a request with the token
        const response = yield (0, supertest_1.default)(server_1.servers)
            .delete(`/api/users/delete/${insertedUser[0]._id}`)
            .set("x-auth-token", token);
        // Expecting a 200 OK response
        expect(response.status).toBe(200);
        // Ensure the correct message is returned
        expect(response.body.message).toBe("User deleted successfully");
    }));
    // Test Case for User Not Found
    it("should return 404 if user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock an admin user
        const adminUser = new userSchema_1.default({ isAdmin: true });
        // Generate a JWT token for the admin user
        const token = jsonwebtoken_1.default.sign({ userId: adminUser._id, isAdmin: true }, config_1.default.get("jwtPrivateKey"));
        // Send a request to delete a non-existent user with an ID that doesn't exist
        const response = yield (0, supertest_1.default)(server_1.servers)
            .delete(`/api/users/delete/65e4b26ae71bf7d92bbc32d7
        `)
            .set("x-auth-token", token);
        // Expecting a 404 Not Found response
        expect(response.status).toBe(404);
        // Ensure the correct message is returned
        expect(response.body.message).toBe("User not found");
    }));
    // Test Case for Internal Server Error
    it("should return 500 if an internal server error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock an admin user
        const adminUser = new userSchema_1.default({ isAdmin: true });
        // Generate a JWT token for the admin user
        const token = jsonwebtoken_1.default.sign({ userId: adminUser._id, isAdmin: true }, config_1.default.get("jwtPrivateKey"));
        // Mock a function that throws an error when trying to delete a user
        jest
            .spyOn(userSchema_1.default, "findByIdAndDelete")
            .mockRejectedValue(new Error("Something went wrong"));
        // Send a request to delete a user
        const response = yield (0, supertest_1.default)(server_1.servers)
            .delete(`/api/users/delete/nonexistentuserid`)
            .set("x-auth-token", token);
        // Expecting a 500 Internal Server Error response
        expect(response.status).toBe(500);
        // Ensure the correct message is returned
        expect(response.body.message).toBe("Internal Server Error");
    }));
});
describe("login user", () => {
    describe("POST /api/login", () => {
        it("should return a valid JWT token for a valid user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Assuming you have a test user with known credentials
            const testUser = {
                email: "kyrieIrving23@gmail.com",
                password: "1234567", // Assuming this is the correct password for the test user
            };
            // Make a POST request to the login endpoint with the test user credentials
            const response = yield (0, supertest_1.default)(server_1.servers)
                .post("/api/users/login")
                .send(testUser);
            // Verify that the response status is 200
            expect(response.status).toBe(200);
            // Verify that the response contains a token
            expect(response.body.token).toBeDefined();
            // Verify the token and assign it the DecodedToken type
            const decodedToken = jsonwebtoken_1.default.verify(response.body.token, config_1.default.get("jwtPrivateKey")); // Using 'as' keyword to assert the type
            // Expectations
            expect(decodedToken._id).toBeDefined();
            expect(decodedToken.isAdmin).toBeDefined();
        }));
        it("should return an error for invalid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
            // Assuming you have invalid credentials for testing
            const invalidUser = {
                email: "invalid@example.com",
                password: "wrongpassword",
            };
            // Make a POST request to the login endpoint with invalid credentials
            const response = yield (0, supertest_1.default)(server_1.servers)
                .post("/api/users/login")
                .send(invalidUser);
            // Verify that the response status is 400
            expect(response.status).toBe(400);
            // Verify that the response contains an error message
            expect(response.text).toBe("Invalid email or password");
        }));
        it("should return an error for invalid password", () => __awaiter(void 0, void 0, void 0, function* () {
            // Assuming you have invalid credentials for testing
            const invalidUser = {
                email: "kyrieIrving23@gmail.com",
                password: "wrongpassword",
            };
            // Make a POST request to the login endpoint with invalid credentials
            const response = yield (0, supertest_1.default)(server_1.servers)
                .post("/api/users/login")
                .send(invalidUser);
            // Verify that the response status is 400
            expect(response.status).toBe(400);
            // Verify that the response contains an error message
            expect(response.text).toBe("Invalid email or password");
        }));
        it("should return 400 for invalid request body", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock request and response objects
            const req = {
                body: {},
            };
            const invalidUser = {
                email: "",
                password: "",
            };
            const response = yield (0, supertest_1.default)(server_1.servers)
                .post("/api/users/login")
                .send(invalidUser);
            // Expecting a 400 Bad Request response
            expect(response.status).toBe(400);
            //  expect(res.send).toHaveBeenCalledWith("Invalid request body");
        }));
        it("should return 500 for Internal server error", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock request and response objects
            const invalidUser = {
            //  email: "",
            //  password: "",
            };
            const response = yield (0, supertest_1.default)(server_1.servers)
                .post("/api/users/login")
                .send(invalidUser);
            // Expecting a 400 Bad Request response
            expect(response.status).toBe(400);
            //  expect(res.send).toHaveBeenCalledWith("Invalid request body");
        }));
    });
});
describe("get current user", () => {
    describe("GET /api/users/me", () => {
        it("should get current logged in user", () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = "65f5d2caa4a8e0ec0804cf19"; // Replace this with your actual user ID
            const token = jsonwebtoken_1.default.sign({ _id: userId }, config_1.default.get("jwtPrivateKey"));
            const response = yield (0, supertest_1.default)(server_1.servers)
                .get("/api/users/me")
                .set("x-auth-token", token);
            expect(response.status).toBe(200); // Use response.status instead of res.status
        }));
        it("should return 401 if token is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = "65eaf11edd40e6f1317d288da";
            const token = jsonwebtoken_1.default.sign({ _id: userId }, config_1.default.get("jwtPrivateKey"));
            const response = yield (0, supertest_1.default)(server_1.servers).get("/api/users/me");
            // .set("x-auth-token", token);
            expect(response.status).toBe(401);
            // expect(response.body).toEqual({
            //   message: "No token, authorization denied",
            // });
        }));
        it("should return 404 if user not found", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock a user ID (you should replace this with a valid user ID)
            const userId = "65e9d33bf8762d0cbbde70b4";
            // Generate a JWT token with the mocked user ID
            const token = jsonwebtoken_1.default.sign({ _id: userId }, config_1.default.get("jwtPrivateKey"));
            // Send a request to the endpoint with the generated token
            const response = yield (0, supertest_1.default)(server_1.servers)
                .get("/api/users/me")
                .set("x-auth-token", token);
            // Expecting a 404 Not Found response
            expect(response.status).toBe(404);
            // Ensure the correct message is returned
            expect(response.body.message).toBe("User not found");
        }));
        it("should return 500 if an internal server error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock an admin user
            const adminUser = new userSchema_1.default({ isAdmin: true });
            // Generate a JWT token for the admin user
            const token = jsonwebtoken_1.default.sign({ userId: adminUser._id, isAdmin: true }, config_1.default.get("jwtPrivateKey"));
            // Mock a function that throws an error when trying to find a user
            jest
                .spyOn(userSchema_1.default, "findById")
                .mockRejectedValue(new Error("Something went wrong"));
            // Send a request to get the current user
            const response = yield (0, supertest_1.default)(server_1.servers)
                .get(`/api/users/me`)
                .set("x-auth-token", token);
            // Expecting a 500 Internal Server Error response
            //  expect(response.status).toBe(200);
            // Ensure the correct message is returned
            expect(response.body.message).toBe("Internal Server Error");
        }));
    });
});
describe("get user count", () => {
    describe("GET /api/users/getUserCount", () => {
        it("should return the count of users when authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
            // Assuming you have a valid authentication token for testing
            const token = jsonwebtoken_1.default.sign({ userId: "65e4b26ae71bf7d92bbc32d7" }, config_1.default.get("jwtPrivateKey"));
            // Make a GET request to the getUserCount endpoint with authentication token
            const response = yield (0, supertest_1.default)(server_1.servers)
                .get("/api/users/getUserCount")
                .set("x-auth-token", `${token}`);
            // Verify that the response status is 200
            expect(response.status).toBe(200);
            // Verify that the response contains the count of users
            expect(response.body.count).toBeDefined();
            // Adjust the expected count based on your test environment
        }));
        it("should return 401 Unauthorized when not authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
            // Make a GET request to the getUserCount endpoint without authentication token
            const response = yield (0, supertest_1.default)(server_1.servers).get("/api/users/getUserCount");
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
                .spyOn(userSchema_1.default, "countDocuments")
                .mockRejectedValue(new Error("Something went wrong"));
            // Send a request to delete a user
            const response = yield (0, supertest_1.default)(server_1.servers)
                .get(`/api/users/getUserCount`)
                .set("x-auth-token", token);
            // Expecting a 500 Internal Server Error response
            expect(response.status).toBe(500);
            // Ensure the correct message is returned
            expect(response.body.message).toBe("Internal Server Error");
        }));
    });
});
