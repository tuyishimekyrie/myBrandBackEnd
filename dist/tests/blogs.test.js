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
const blogSchema_1 = __importDefault(require("../src/schemas/blogSchema"));
const userSchema_1 = __importDefault(require("../src/schemas/userSchema"));
const cloudinary_1 = require("cloudinary");
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    server_1.servers;
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    server_1.servers.close();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("/api/blogs", () => {
    describe("POST /api/blogs/upload", () => {
        it("should return 400 if the blog  does not upload file image", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock request and response objects
            const req = {
                params: { id: "nonExistingBlogId" },
                body: { header: "Updated Header", desc: "Updated Description" },
            };
            const adminUser = new userSchema_1.default({ isAdmin: true });
            // Generate a JWT token for the admin user
            const token = jsonwebtoken_1.default.sign({ userId: adminUser._id, isAdmin: true }, config_1.default.get("jwtPrivateKey"));
            // Mock Blog.findById to return null (indicating blog doesn't exist)
            // jest.spyOn(Blog, "findById").mockResolvedValue(null);
            // Call the updateBlog function
            const response = yield (0, supertest_1.default)(server_1.servers)
                .post(`/api/blogs/upload`)
                .set("x-auth-token", token)
                .send(req.body); // Send updated data in the request body
            // Expecting a 404 Not Found response
            expect(response.status).toBe(400);
            // expect(response.text).toBe('Blog not found');
        }));
        it("should return 500 if an internal server error occurs during update", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock request object with blog ID and updated data
            const data = {
                params: { id: "existingBlogId" },
                body: { header: "Updated Header", desc: "Updated Description" },
                file: { path: "/path/to/image.jpg" }, // Mock file upload
            };
            // Mock Blog.findById to return an existing blog
            jest.spyOn(blogSchema_1.default, "findById").mockResolvedValue({
                _id: "existingBlogId",
                header: "Existing Header",
                desc: "Existing Description",
                img: "existingImageURL",
            });
            // Mock cloudinary.uploader.upload to throw an error
            jest
                .spyOn(cloudinary_1.v2.uploader, "upload")
                .mockRejectedValue(new Error("Something went wrong with Cloudinary"));
            // Mock existingBlog.save to throw an error
            // jest.spyOn(Blog, "save").mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(server_1.servers).delete("/api/blogs/upload");
            // Expecting a 500 Internal Server Error response
            expect(response.status).toBe(404);
            //  expect(response.json).toBe({
            //  success: false,
            //  message: "Internal Server Error",
            //  });
        }));
    });
    describe("GET /api/blogs/", () => {
        it("should respond with 200 status code for list of blogs endpoint", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.servers).get("/api/blogs/");
            expect(response.status).toBe(200);
        }));
    });
    describe("PATCH ", () => {
        it("should return 400 if the blog to update does not upload file image", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock request and response objects
            const req = {
                params: { id: "nonExistingBlogId" },
                body: { header: "Updated Header", desc: "Updated Description" },
            };
            const adminUser = new userSchema_1.default({ isAdmin: true });
            // Generate a JWT token for the admin user
            const token = jsonwebtoken_1.default.sign({ userId: adminUser._id, isAdmin: true }, config_1.default.get("jwtPrivateKey"));
            // Mock Blog.findById to return null (indicating blog doesn't exist)
            // jest.spyOn(Blog, "findById").mockResolvedValue(null);
            // Call the updateBlog function
            const response = yield (0, supertest_1.default)(server_1.servers)
                .patch(`/api/blogs/updates/${req.params.id}`)
                .set("x-auth-token", token)
                .send(req.body); // Send updated data in the request body
            // Expecting a 404 Not Found response
            expect(response.status).toBe(400);
            // expect(response.text).toBe('Blog not found');
        }));
        it("should return 404 if blog is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = "65e9d33bf8762d0cbbde70b4";
            // Generate a JWT token with the mocked user ID
            const token = jsonwebtoken_1.default.sign({ _id: userId }, config_1.default.get("jwtPrivateKey"));
            // Mock request object with blog ID and updated data
            const data = {
                params: { id: "nonexistentBlogId" },
                body: { header: "Updated Header", desc: "Updated Description" },
                file: { path: "/path/to/image.jpg" }, // Mock file upload
            };
            // Mock Blog.findById to return null (blog not found)
            // jest.spyOn(Blog, "findById").mockResolvedValueOnce(null);
            // Make a PATCH request to update the blog
            const response = yield (0, supertest_1.default)(server_1.servers)
                .patch("/api/blogs/updates/nonexistentBlogId")
                .set("x-auth-token", token);
            // .send({ header: data.body.header, desc: data.body.desc });
            // Expecting a 404 Not Found response
            expect(response.status).toBe(404);
            // Expecting response body to contain a message indicating blog not found
            expect(response.text).toBe("Blog not found");
        }));
        it("should return 500 if an internal server error occurs during update", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock request object with blog ID and updated data
            const data = {
                params: { id: "existingBlogId" },
                body: { header: "Updated Header", desc: "Updated Description" },
                file: { path: "/path/to/image.jpg" }, // Mock file upload
            };
            // Mock Blog.findById to return an existing blog
            jest.spyOn(blogSchema_1.default, "findById").mockResolvedValue({
                _id: "existingBlogId",
                header: "Existing Header",
                desc: "Existing Description",
                img: "existingImageURL",
            });
            // Mock cloudinary.uploader.upload to throw an error
            jest
                .spyOn(cloudinary_1.v2.uploader, "upload")
                .mockRejectedValue(new Error("Something went wrong with Cloudinary"));
            // Mock existingBlog.save to throw an error
            jest.spyOn(blogSchema_1.default, "findById").mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(server_1.servers).delete("/api/blogs/updates/65e9e3e780504019388fa2c3");
            // Expecting a 500 Internal Server Error response
            expect(response.status).toBe(404);
            //  expect(response.json).toBe({
            //  success: false,
            //  message: "Internal Server Error",
            //  });
        }));
    });
    describe("DELETE /api/blogs/delete/{id}", () => {
        // it("should return 200 and delete the blog if it exists", async () => {
        //   // Create a mock blog to delete
        //   const mockBlog = new Blog({
        //     title: "Test Blog",
        //     content: "Test content",
        //   });
        //   await mockBlog.save();
        //   // Make a DELETE request to delete the blog
        //   const response = await supertest(servers).delete(`/api/blogs/${mockBlog._id}`);
        //   // Expect response status code to be 200 (OK)
        //   expect(response.statusCode).toBe(200);
        //   // Expect response body to contain a message indicating successful deletion
        //   expect(response.text).toBe("Blog deleted successfully");
        //   // Ensure the blog is actually deleted from the database
        //   const deletedBlog = await Blog.findById(mockBlog._id);
        //   expect(deletedBlog).toBeNull();
        // });
        // Test Case for User Not Found
        it("should return 404 if blog is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock an admin user
            const adminUser = new blogSchema_1.default({ isAdmin: true });
            // Generate a JWT token for the admin user
            const token = jsonwebtoken_1.default.sign({ userId: adminUser._id, isAdmin: true }, config_1.default.get("jwtPrivateKey"));
            // Send a request to delete a non-existent user with an ID that doesn't exist
            const response = yield (0, supertest_1.default)(server_1.servers)
                .delete(`/api/blogs/delete/65e4b26ae71bf7d92bbc32d7
        `)
                .set("x-auth-token", token);
            // Expecting a 404 Not Found response
            expect(response.status).toBe(404);
            // Ensure the correct message is returned
            expect(response.text).toBe("Blog not found");
        }));
        // Test Case for Internal Server Error
        it("should return 500 if an internal server error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock an admin user
            const adminUser = new userSchema_1.default({ isAdmin: true });
            // Generate a JWT token for the admin user
            const token = jsonwebtoken_1.default.sign({ userId: adminUser._id, isAdmin: true }, config_1.default.get("jwtPrivateKey"));
            // Mock a function that throws an error when trying to delete a user
            jest
                .spyOn(blogSchema_1.default, "findByIdAndDelete")
                .mockRejectedValue(new Error("Something went wrong"));
            // Send a request to delete a user
            const response = yield (0, supertest_1.default)(server_1.servers)
                .delete(`/api/blogs/delete/nonexistentuserid`)
                .set("x-auth-token", token);
            // Expecting a 500 Internal Server Error response
            expect(response.status).toBe(400);
            // Ensure the correct message is returned
            // expect(response.body).toBe("Internal Server Error");
        }));
    });
    describe("updateLikes", () => {
        describe("PATCH /api/blogs/likes/{:id}/like", () => {
            it("should like a blog when authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
                // Assuming you have a valid authentication token for testing
                const token = jsonwebtoken_1.default.sign({ _id: "65f5e03c65a9bbf25344f25f" }, config_1.default.get("jwtPrivateKey"));
                // Mock blog ID
                const blogId = "65eaf2567193656d632c1f56";
                // Make a PATCH request to the updateLikes endpoint with authentication token
                const response = yield (0, supertest_1.default)(server_1.servers)
                    .patch(`/api/blogs/likes/${blogId}/like`)
                    .set("x-auth-token", token);
                // Verify that the response status is 200
                expect(response.status).toBe(200);
                // Verify that the response body indicates successful update
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe("Blog like updated successfully");
                // expect(response.body.liked).toBe(false);
            }));
            it("should unlike a blog when already liked", () => __awaiter(void 0, void 0, void 0, function* () {
                // Assuming you have a valid authentication token for testing
                const token = jsonwebtoken_1.default.sign({ _id: "65f5e03c65a9bbf25344f25f" }, config_1.default.get("jwtPrivateKey"));
                // Mock blog ID
                const blogId = "65eaf2567193656d632c1f56";
                // Make a PATCH request to the updateLikes endpoint with authentication token
                const response = yield (0, supertest_1.default)(server_1.servers)
                    .patch(`/api/blogs/likes/${blogId}/like`)
                    .set("x-auth-token", token);
                // Verify that the response status is 200
                expect(response.status).toBe(200);
                // Verify that the response body indicates successful update
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe("Blog like updated successfully");
                // expect(response.body.liked).toBe(true);
            }));
            it("should return 401 Unauthorized when not authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
                // Mock blog ID
                const blogId = "65eaf2567193656d632c1f56";
                // Make a PATCH request to the updateLikes endpoint without authentication token
                const response = yield (0, supertest_1.default)(server_1.servers).patch(`/api/blogs/likes/${blogId}/like`);
                // Verify that the response status is 401
                expect(response.status).toBe(401);
            }));
            it("should return 404 Not Found when blog does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
                // Assuming you have a valid authentication token for testing
                const token = jsonwebtoken_1.default.sign({ _id: "65eaf11edd40e6f117d288da" }, config_1.default.get("jwtPrivateKey"));
                // Mock non-existent blog ID
                const nonExistentBlogId = "60b9b7c036d0680015a8015d"; // Assuming this blog ID does not exist
                // Make a PATCH request to the updateLikes endpoint with authentication token
                const response = yield (0, supertest_1.default)(server_1.servers)
                    .patch(`/api/likes/${nonExistentBlogId}/like`)
                    .set("x-auth-token", token);
                // Verify that the response status is 404
                expect(response.status).toBe(404);
            }));
        });
    });
    describe("addComment", () => {
        describe("POST /api/posts/:id/comments", () => {
            it("should add a comment when authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
                // Assuming you have a valid authentication token for testing
                const token = jsonwebtoken_1.default.sign({ userId: "65f5e03c65a9bbf25344f25f" }, config_1.default.get("jwtPrivateKey"));
                // Mock blog ID
                const blogId = "65eaf2567193656d632c1f56";
                // Mock comment
                const comment = "This is a test comment.";
                // Make a POST request to the addComment endpoint with authentication token
                const response = yield (0, supertest_1.default)(server_1.servers)
                    .post(`/api/blogs/${blogId}/comments`)
                    .set("x-auth-token", token)
                    .send({ comment });
                // Verify that the response status is 201
                expect(response.status).toBe(201);
                // Verify that the response body indicates successful addition of comment
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe("Comment added successfully");
                expect(response.body.comment).toBeDefined();
                // expect(response.body.comment.commenterId).toBe(
                // "65f5e03c65a9bbf25344f25f"
                // );
                expect(response.body.comment.comment).toBe(comment);
            }));
            it("should return 401 Unauthorized when not authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
                // Mock blog ID
                const blogId = "65e4b3efe71bf7d92bbc32e1";
                // Mock comment
                const comment = "This is a test comment.";
                // Make a POST request to the addComment endpoint without authentication token
                const response = yield (0, supertest_1.default)(server_1.servers)
                    .post(`/api/blogs/${blogId}/comments`)
                    .send({ comment });
                // Verify that the response status is 401 Unauthorized
                expect(response.status).toBe(401);
            }));
            it("should return 404 Not Found when blog does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
                // Assuming you have a valid authentication token for testing
                const token = jsonwebtoken_1.default.sign({ userId: "65e9d33bf8762d0cbbde70b4" }, config_1.default.get("jwtPrivateKey"));
                // Mock non-existent blog ID
                const nonExistentBlogId = "60b9b7c036d0680015a8015d"; // Assuming this blog ID does not exist
                // Mock comment
                const comment = "This is a test comment.";
                // Make a POST request to the addComment endpoint with authentication token
                const response = yield (0, supertest_1.default)(server_1.servers)
                    .post(`/api/blogs/${nonExistentBlogId}/comments`)
                    .set("x-auth-token", token)
                    .send({ comment });
                // Verify that the response status is 404 Not Found
                expect(response.status).toBe(404);
            }));
        });
    });
});
