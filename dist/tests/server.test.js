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
afterAll(() => {
    server_1.servers.close();
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Express App", () => {
    it("should return a welcome message at the root route", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.servers).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello from the backend!");
    }));
    //  it("should handle undefined dbpassword environment variable", async () => {
    //    // Mock console.error to spy on logs
    //    const spy = jest.spyOn(console, "error").mockImplementation();
    //    // Make sure dbpassword is undefined in the configuration
    //    jest.spyOn(config, "has").mockReturnValueOnce(false);
    //    // Restart the app with the undefined dbpassword
    //    // Since the environment is not reset between tests, this will ensure the app behaves as expected
    //    const { app: restartedApp } = require("../src/server"); // Adjust the path accordingly
    //    // Make a request to the root route to trigger the error message
    //    await supertest(restartedApp).get("/");
    //    // Assert that the error message was logged
    //    expect(spy).toHaveBeenCalled();
    //    expect(spy).toHaveBeenCalledWith(
    //      "FATAL ERROR: Database password is not defined in configuration"
    //    );
    //    // Restore the original console.error function
    //    spy.mockRestore();
    //  });
});
