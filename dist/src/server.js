"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = __importDefault(require("./routers/users"));
const blogs_1 = __importDefault(require("./routers/blogs"));
const messages_1 = __importDefault(require("./routers/messages"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_1 = __importDefault(require("./utils/swagger"));
const app = (0, express_1.default)();
(0, swagger_1.default)(app, 3000);
if (!config_1.default.get("jwtPrivateKey")) {
    console.error("Configuration is not set");
    process.exit(1);
}
const dbpassword = process.env.dbpassword;
if (!dbpassword) {
    console.error("FATAL ERROR: dbpassword environment variable is not defined");
    process.exit(1);
}
mongoose_1.default
    .connect(`mongodb+srv://tuyishimehope:${dbpassword}@mybrandbackendapi.mcajjcn.mongodb.net/mybrandbackeddb`)
    .then(() => console.log("Database Running"))
    .catch((error) => console.error("Database Connection Failed:", error));
const PORT = process.env.PORT || 3000;
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/users", users_1.default);
app.use("/api/blogs", blogs_1.default);
app.use("/api/messages", messages_1.default);
app.get("/", (req, res) => {
    res.send("Hello from the backend!");
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});