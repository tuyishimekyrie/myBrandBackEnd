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
const blogSchema_1 = __importDefault(require("../src/schemas/blogSchema"));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    server_1.servers;
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    server_1.servers.close();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("GET /api/blogs", () => {
    it("should return 500 if an internal server error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock an error condition by making Blog.find throw an error
        jest
            .spyOn(blogSchema_1.default, "find")
            .mockRejectedValue(new Error("Something went wrong"));
        // Make a GET request to the route
        const response = yield (0, supertest_1.default)(server_1.servers).get("/api/blogs");
        // Expect response status code to be 500 (Internal Server Error)
        expect(response.statusCode).toBe(500);
        // Expect response body to contain a message indicating internal server error
        expect(response.text).toBe("Internal Server Error");
    }));
});
