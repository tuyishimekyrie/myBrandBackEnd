"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const logger_1 = __importDefault(require("./logger"));
const fs_1 = __importDefault(require("fs"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My Brand Backend v1.0",
            description: "Welcome to My Brand Backend API. This API serves as the backbone for managing various aspects of My Brand, providing essential functionalities to power your application. It offers endpoints for user authentication, blog management, image uploads, and much more. With robust security measures and intuitive design, My Brand Backend API empowers developers to build powerful applications with ease.",
            version: "v1.0",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "apiKey",
                    name: "x-auth-token",
                    in: "header",
                    description: "Bearer token authorization",
                },
            },
        },
        //   servers: [
        //     {
        //       url: "http://localhost:3000/docs",
        //       description: "Local development environment",
        //     },
        //     {
        //       url: "https://mybrandbackend-q8gq.onrender.com/docs/",
        //       description: "Production Environment",
        //     },
        //   ],
    },
    apis: ["./src/server.ts", "./src/routers/*.ts", "./src/schemas/*.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app, port) {
    // Serve Swagger UI
    //   app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, {
        customCss: `
          ${fs_1.default.readFileSync("./src/utils/SwaggerDark.css")}
        `,
    }));
    // Serve Swagger JSON
    app.get("/docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    // Log Swagger availability
    logger_1.default.info(`Swagger docs available at http://localhost:${port}/docs`);
}
exports.default = swaggerDocs;
