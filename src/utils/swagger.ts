import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import log from "./logger";
import fs from "fs";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Brand Backend v1.0",
      description:
        "Welcome to My Brand Backend API. This API serves as the backbone for managing various aspects of My Brand, providing essential functionalities to power your application. It offers endpoints for user authentication, blog management, image uploads, and much more. With robust security measures and intuitive design, My Brand Backend API empowers developers to build powerful applications with ease.",
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

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  // Serve Swagger UI
  //   app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: `
          ${fs.readFileSync("./src/utils/SwaggerDark.css")}
        `,
    })
  );
  // Serve Swagger JSON
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // Log Swagger availability
  log.info(`Swagger docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
