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
      title: "My Brand BackEnd v1",
      version,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          name: "x-auth-token",
          in: "header",
          description: "Bearer token authorization"
        },
      },
    },
    // components:
    // security: [
      // {
        // bearerAuth: [],
      // },
    // ],
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
