import express, { NextFunction, Request, Response } from "express";
import config from "config";
import mongoose from "mongoose";
import users from "./routers/users";
import blogs from "./routers/blogs";
import messages from "./routers/messages";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import swaggerDocs from "./utils/swagger";
import createServer from "./utils/serverTest";

export const app = createServer();

swaggerDocs(app, 3000);

if (!config.get("jwtPrivateKey")) {
  console.error("Configuration is not set");
  process.exit(1);
}
// const dbpassword = process.env.dbpassword;
const dbpassword = config.get("dbpassword");


if (!config.get("dbpassword")) {
  console.error("FATAL ERROR: dbpassword environment variable is not defined");
  process.exit(1);
}

const db = config.get('db')

mongoose
  .connect(
   config.get("db")
  )
  .then(() => console.log("Database Running", db))
  .catch((error) => console.error("Database Connection Failed:", error));


const PORT = process.env.PORT || 3000;
app.use(cookieParser());
app.use(cors());
app.use(express.json());


app.use("/api/users", users);

app.use("/api/blogs", blogs);

app.use("/api/messages", messages);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the backend!");
});

export const servers = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
